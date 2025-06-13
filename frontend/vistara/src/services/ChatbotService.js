// Chatbot service for handling messages and responses
// This can be extended later to connect to a backend API for more intelligent responses

// Sample predefined responses for the chatbot
const PREDEFINED_RESPONSES = {
  greeting: [
    "Hello! I'm your Copilot assistant. How can I help you today?",
    "Hi there! I'm ready to assist you. What do you need help with?",
    "Welcome! I'm your virtual assistant. What can I do for you?"
  ],
  farewell: [
    "Goodbye! Feel free to chat again if you need assistance.",
    "Have a great day! I'm here if you need any further help.",
    "Bye! Come back anytime you have questions."
  ],
  fallback: [
    "I'm not sure I understand. Could you please rephrase that?",
    "I don't have an answer for that yet. Is there something else I can help with?",
    "I'm still learning about that. Can you ask me something else?"
  ],
  help: [
    "I can help you navigate the site, create posts, manage your stories, or answer questions about features. What would you like to know?",
    "Need help? I can provide information about creating posts, managing your account, or using the stories feature. Just ask!",
    "I'm here to assist with any questions about the platform. Try asking about how to create a post or story!"
  ],
  post: [
    "To create a new post, click the 'Create New Announcement' button at the top of the home page. You can choose between text or image posts!",
    "Creating a post is easy! Just click the plus button on the home page and fill out the form. Don't forget you can choose text posts with colored backgrounds too!",
    "Want to make a new post? Click the 'Create New Announcement' button and choose your post type - you can add images or create text posts with colorful backgrounds."
  ],
  story: [
    "Stories appear at the top of your home page. Click 'Add Story' to create a new one that will be visible for 24 hours!",
    "To create a story, click the 'Add Story' button in the stories section. You can upload photos, videos or create text stories with different background colors.",
    "Stories are a great way to share quick updates! They'll disappear after 24 hours. Create one by clicking 'Add Story' in the stories section."
  ],
  search: [
    "You can search for posts by clicking the search icon in the header and typing keywords.",
    "Looking for something specific? Use the search bar at the top of the page to find posts containing your keywords.",
    "Need to find a particular post? The search feature in the header will help you locate it quickly."
  ],
  profile: [
    "Your profile can be accessed by clicking on your avatar in the top right corner of the page.",
    "To view or edit your profile, click your profile picture in the header and select 'Profile' from the dropdown menu.",
    "Want to update your profile? Click your avatar in the top right, then select 'Profile' to make changes."
  ],
  settings: [
    "App settings can be found by clicking your profile picture and selecting 'Settings' from the dropdown menu.",
    "To change your notification preferences or other settings, click your avatar in the top right corner, then select 'Settings'.",
    "Looking for the settings page? Click your profile picture in the header and choose 'Settings' from the menu."
  ],
  background: [
    "Text posts allow you to select from 10 different background colors to make your announcements stand out!",
    "When creating a text post, you can choose from several background colors to personalize your announcement.",
    "Want to make your text post more eye-catching? Choose from our selection of colorful backgrounds when creating your announcement."
  ],
  notifications: [
    "Notifications appear in the bell icon at the top of the page. Click it to see your latest updates.",
    "You can see new interactions with your posts and stories by clicking the bell icon in the header.",
    "Stay updated by checking your notifications through the bell icon in the top navigation bar."
  ],
  "announcements": [
    "Announcements are posts that appear in your main feed. You can create text or image announcements that will be visible to everyone. To create one, click the 'Create New Announcement' button at the top.",
    "The announcements section shows all recent posts from users. You can like, comment, and interact with these posts. To create your own, use the 'Create New Announcement' button.",
    "This is where all campus announcements appear. Posts can include text with colored backgrounds or images. You can engage with posts by liking or commenting on them."
  ],
  "creating announcements": [
    "To create a new announcement, click the 'Create New Announcement' button. You can choose between text posts with colorful backgrounds or image posts. Add your content and click 'Post' when you're done!",
    "Creating an announcement is easy! Click the button with the plus icon, enter your text, choose a background color or add an image, and then post it for everyone to see.",
    "When creating an announcement, you can add text, choose a background color, or upload an image. Once posted, it will appear in the main feed for everyone to see and interact with."
  ],
  "creating your first announcement": [
    "Ready to create your first announcement? Just click the 'Create Announcement' button! You can share text with a colorful background or add an image. It's a great way to make important information stand out.",
    "For your first announcement, we recommend a text post with a colorful background. Click the button, write your message, select a color that matches your mood, and share it with the community!",
    "Welcome! To create your first announcement, click the button and follow the simple steps. You can choose between text or image posts, add your content, and share it instantly."
  ],
  "stories": [
    "Stories are temporary posts that disappear after 24 hours. You can view stories by clicking on the profile circles at the top of your feed. To create your own, click 'Add Story'.",
    "The stories section shows circles for each user who has posted a story. Click on a circle to view their story. Stories can be images or text with colorful backgrounds.",
    "Stories are a quick way to share updates that don't need to be permanent. They appear at the top of the home page and disappear after 24 hours. Click on a user's circle to view their stories."
  ],
  "creating stories": [
    "To create a story, click the 'Add Story' button in the stories section. You can upload a photo or create a text story with a colorful background. Your story will be visible for 24 hours.",
    "Creating a story is simple! Click 'Add Story', choose between text or image, add your content and publish. Your story will appear in the stories row at the top of the home page.",
    "Stories are perfect for quick updates. To create one, click 'Add Story', select your media type (text or image), customize it with colors or captions, and share it with everyone for the next 24 hours."
  ],
  "creating your first story": [
    "Ready to create your first story? Click 'Create First Story' and choose between text or image. Text stories let you share a quick update with a colorful background, while image stories let you share photos. Stories disappear after 24 hours!",
    "For your first story, we recommend trying a text story with a vibrant background color. Click the button, type your message, pick a color, and share it! Your friends will see it at the top of their feed.",
    "Creating your first story is easy! Click the button, decide if you want to share text or an image, customize it, and post. Stories are temporary and will automatically disappear after 24 hours."
  ],
  "voice_commands": [
    "You can use voice commands to create announcements! Just click the microphone icon next to the text field and start speaking. The system will convert your speech to text automatically.",
    "Voice input is available for creating announcements. Click the microphone button in the text area and speak clearly - your words will be transcribed into the text field.",
    "Need to create an announcement hands-free? Use the voice command feature by clicking the microphone icon. You can also select different languages using the dropdown next to the microphone."
  ]
};

// Enhanced keyword mapping for better response matching
const KEYWORD_MAPPING = {
  greeting: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'welcome', 'morning', 'afternoon', 'evening'],
  farewell: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'take care', 'cya'],
  help: ['help', 'assist', 'support', 'guidance', 'info', 'information', 'how to', 'how do i', 'tutorial'],
  post: ['post', 'announcement', 'create post', 'make post', 'publish', 'share', 'write'],
  story: ['story', 'stories', 'create story', 'make story', 'add story', '24 hours'],
  search: ['search', 'find', 'lookup', 'locate', 'discover', 'filter'],
  profile: ['profile', 'account', 'my info', 'my information', 'edit profile', 'my account'],
  settings: ['settings', 'preferences', 'config', 'configure', 'options', 'privacy'],
  background: ['background', 'color', 'colors', 'theme', 'customization', 'customize'],
  notifications: ['notifications', 'alerts', 'notify', 'notified', 'bell', 'update', 'updates'],
  voice_commands: ['voice', 'speech', 'speak', 'talk', 'mic', 'microphone', 'voice command', 'voice input', 'dictate', 'dictation'],
  "announcement": "announcements",
  "announcements": "announcements",
  "feed": "announcements",
  "posts": "announcements",
  "new announcement": "creating announcements",
  "create announcement": "creating announcements",
  "make announcement": "creating announcements",
  "post announcement": "creating announcements",
  "first announcement": "creating your first announcement",
  "start announcement": "creating your first announcement",
  "begin announcement": "creating your first announcement",
  "story": "stories",
  "stories": "stories",
  "story feature": "stories",
  "view story": "stories",
  "view stories": "stories",
  "new story": "creating stories",
  "create story": "creating stories",
  "make story": "creating stories",
  "add story": "creating stories",
  "first story": "creating your first story",
  "start story": "creating your first story",
  "begin story": "creating your first story"
};

// Helper function to get a random response from a category
const getRandomResponse = (category) => {
  const responses = PREDEFINED_RESPONSES[category] || PREDEFINED_RESPONSES.fallback;
  return responses[Math.floor(Math.random() * responses.length)];
};

// More sophisticated message categorization
const categorizeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for voice command related queries
  if (lowerMessage.includes('voice') || 
      lowerMessage.includes('speech') || 
      lowerMessage.includes('mic') || 
      lowerMessage.includes('dictate') ||
      lowerMessage.includes('speak') && lowerMessage.includes('text')) {
    return 'voice_commands';
  }
  
  // Check each category for matching keywords
  for (const [category, keywords] of Object.entries(KEYWORD_MAPPING)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Advanced pattern matching (could be expanded with natural language processing)
  if (lowerMessage.match(/how (do|can|to) .+\?/)) {
    return 'help';
  }
  
  if (lowerMessage.match(/what (is|are) .+\?/)) {
    return 'help';
  }
  
  if (lowerMessage.match(/where (is|can) .+\?/)) {
    return 'help';
  }
  
  return 'fallback';
};

// Function to generate a response
const generateResponse = async (message) => {
  // This could be replaced with an API call for more intelligent responses
  const category = categorizeMessage(message);
  return getRandomResponse(category);
};

// Export the service
const ChatbotService = {
  generateResponse,
  getRandomGreeting: () => getRandomResponse('greeting')
};

export default ChatbotService; 