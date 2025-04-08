# Intelligent Assistance System
- Dialogflow Agent: VistaraChatbot
- Entity: @content-type (announcement, notice, update)
- Intent: DraftContent
  - Purpose: Draft CMS entries
  - Parameters: content-type (@content-type), content (@sys.any)
  - Response: Static prompt for title
  - Test: "Draft an announcement about a meeting" → "I’ve started your announcement draft with content: a meeting. What’s the title?"
- Status: CMS intent setup complete, tested

Dialogflow Agent: VistaraChatbot
- Entities:
  - @content-type (announcement, event, notice, caption, etc.)
  - @title (Music Fest 2025, Team Meeting, etc.)
  - @category, @department, @reason, @tags
- Intents:
  - CreateEvent: Creates events with title, date, time, location, description for CMS fields.
  - CreateCaption: Creates captions with content, optional event-name/tags.
- Status: Updated CreateEvent, added CreateCaption for CMS integration