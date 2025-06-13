from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import uuid4
from transformers import pipeline
import dateparser
import re
from transformers import pipeline
from pydantic import BaseModel
from typing import Dict

# — HF pipelines —
intent_clf = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
ner        = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")

# slot definitions
REQUIRED_SLOTS = {
    "create_event": ["title", "date", "start_time", "end_time", "location", "description"],
    "create_content": ["content_type", "date", "message"],
}
SLOT_PROMPTS = {
    "title":        "What’s the title of the event?",
    "date":         "On which date should it happen?",
    "start_time":   "What time should it start?",
    "end_time":     "What time should it end?",
    "location":     "Where will it take place?",
    "description":  "How would you describe it?",
    "content_type": "What is it about",
    "message":      "What’s the content message?",
}

GREETINGS = {"hi", "hello", "hey", "good morning", "good afternoon", "good evening"}

# in-memory session store
SESSIONS: Dict[str, Dict[str, Any]] = {}

class ConverseRequest(BaseModel):
    session_id: Optional[str]
    text: str

class ConverseResponse(BaseModel):
    session_id: str
    prompt: Optional[str] = None
    complete: Optional[Dict[str, Any]] = None

app = FastAPI()

# CORS for your React dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET","POST","OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.options("/converse")
def preflight():
    return Response(status_code=200)

@app.post("/converse", response_model=ConverseResponse)
def converse(req: ConverseRequest):
    first_call = req.session_id is None
    sid = req.session_id or str(uuid4())
    sess = SESSIONS.setdefault(sid, {"intent": None, "slots": {}})
    text = req.text.strip()

    # 1) Greeting
    if first_call and text.lower() in GREETINGS:
        return {
            "session_id": sid,
            "prompt": "👋 Hi there! Welcome to Vistara Chatbot. How can I assist you?"
        }

    # 2) First turn: classify + NER + dateparser fallback
    if first_call:
        # Intent classification
        res = intent_clf(text, candidate_labels=list(REQUIRED_SLOTS.keys()))
        sess["intent"] = res["labels"][0]

        # NER extraction
        for ent in ner(text):
            lbl = ent["entity_group"].lower()
            if lbl in REQUIRED_SLOTS[sess["intent"]]:
                sess["slots"][lbl] = ent["word"]

        # Fallback parse relative date if date slot still empty
        if "date" in REQUIRED_SLOTS[sess["intent"]] and "date" not in sess["slots"]:
            dt = dateparser.parse(
                text,
                settings={"PREFER_DATES_FROM": "future", "RETURN_AS_TIMEZONE_AWARE": False}
            )
            if dt:
                sess["slots"]["date"] = dt.date().isoformat()

        # Fallback parse start/end time if those slots empty
        if sess["intent"] == "create_event":
            # look for "from X to Y" in the initial text
            m = re.search(r'(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*(?:to|-)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)',
                          text, flags=re.IGNORECASE)
            if m:
                dt1 = dateparser.parse(m.group(1))
                dt2 = dateparser.parse(m.group(2))
                if dt1: sess["slots"]["start_time"] = dt1.time().strftime("%H:%M")
                if dt2: sess["slots"]["end_time"]   = dt2.time().strftime("%H:%M")

    else:
        # 3) Subsequent turns: fill next missing slot
        for slot in REQUIRED_SLOTS[sess["intent"]]:
            if slot not in sess["slots"]:
                raw = text
                if slot == "date":
                    dt = dateparser.parse(
                        raw,
                        settings={"PREFER_DATES_FROM": "future", "RETURN_AS_TIMEZONE_AWARE": False}
                    )
                    if dt:
                        raw = dt.date().isoformat()
                elif slot == "start_time":
                    parts = re.split(r'\s+to\s+|\s*-\s*', raw, flags=re.IGNORECASE)
                    if len(parts) >= 2:
                        dt1 = dateparser.parse(parts[0])
                        dt2 = dateparser.parse(parts[1])
                        if dt1: sess["slots"]["start_time"] = dt1.time().strftime("%H:%M")
                        if dt2: sess["slots"]["end_time"]   = dt2.time().strftime("%H:%M")
                        break
                    dt = dateparser.parse(raw)
                    if dt: raw = dt.time().strftime("%H:%M")
                elif slot == "end_time":
                    dt = dateparser.parse(raw)
                    if dt: raw = dt.time().strftime("%H:%M")
                sess["slots"][slot] = raw
                break

    # 4) Prompt for next missing slot
    for slot in REQUIRED_SLOTS[sess["intent"]]:
        if slot not in sess["slots"]:
            return {"session_id": sid, "prompt": SLOT_PROMPTS[slot]}

    # 5) All slots filled: return complete
    return {
        "session_id": sid,
        "complete": {"intent": sess["intent"], "slots": sess["slots"]}
    }

# load your summarizer once at module‐level
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class SummarizeRequest(BaseModel):
    slots: Dict[str, str]

class SummarizeResponse(BaseModel):
    summary: str

# … your imports and pipeline loading stay the same …

@app.post("/summarize", response_model=SummarizeResponse)
def summarize(req: SummarizeRequest):
    s = req.slots

    # 1) Announcement case: just return the message straight
    if s.get("message"):
        return {"summary": s["message"].strip()}

    # 2) Event case
    prompt = (
        f"Title: {s.get('title','')}. "
        f"Date: {s.get('date','')}. "
        f"Time: {s.get('start_time','')} to {s.get('end_time','')}. "
        f"Location: {s.get('location','')}. "
        f"Details: {s.get('description','')}."
    )

    if not prompt.strip():
        return {"summary": "Sorry, I didn’t get enough details to summarize."}

    # Run the summarizer for events only
    result = summarizer(prompt, max_length=80, min_length=20, do_sample=False)
    return {"summary": result[0]["summary_text"]}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)