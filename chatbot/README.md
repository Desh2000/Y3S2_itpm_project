# Intelligent Assistance System
- Dialogflow Agent: VistaraChatbot
- Entity: @content-type (announcement, notice, update)
- Intent: DraftContent
  - Purpose: Draft CMS entries
  - Parameters: content-type (@content-type), content (@sys.any)
  - Response: Static prompt for title
  - Test: "Draft an announcement about a meeting" → "I’ve started your announcement draft with content: a meeting. What’s the title?"
- Status: CMS intent setup complete, tested