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

# Intelligent Assistance System
- Dialogflow Agent: VistaraChatbot
- Entities:
  - @content-type (announcement, event, notice, reminder, etc.)
  - @title (Music Fest 2025, Team Meeting, Holiday Notice, etc.)
  - @category, @department, @reason, @tags
- Intents:
  - CreateAnnouncement: Creates announcements with title, content, optional date.
  - CreateEvent: Creates events with title, date, time, location, description.
  - CreateNotice: Creates notices with title, date, reason, optional content.
  - CreateReminder: Creates reminders with title, date, content, optional time/location.
- Status: Updated CreateNotice and CreateAnnouncement, added CreateReminder for CMS integration

# Intelligent Assistance System

- Integrations:
  - Google Assistant: Enabled for voice support (Draft mode, free tier).
- Status: Updated responses for new CMS Title field, enabled Google Assistant voice support..