# Design Document

## Overview

The theIndiaCore chatbot is a single-page application (SPA) built entirely with vanilla HTML, CSS, and JavaScript. It requires no backend infrastructure or build tools - users simply open `index.html` in a modern browser. The design emphasizes simplicity, accessibility, and visual polish while maintaining the site's brand identity.

### Key Design Principles

- **Zero Dependencies**: No npm, no build step, no server required
- **Progressive Enhancement**: Core functionality works without JavaScript; enhanced UX with JS enabled
- **Mobile-First Responsive**: Fluid layouts that adapt from 320px to 4K displays
- **Accessibility First**: WCAG 2.1 AA compliant with semantic HTML and ARIA attributes
- **Performance**: Lightweight (<50KB total), instant load, smooth 60fps animations

## Architecture

### Component Structure

```
ChatUI (Main Controller)
├── HeaderCard (Static Component)
│   ├── Logo Image
│   └── Site Title
├── ChatCard (Container)
│   ├── MessageContainer (Scrollable)
│   │   ├── UserBubble (Component)
│   │   ├── BotBubble (Component)
│   │   ├── ErrorBubble (Component)
│   │   └── TypingIndicator (Component)
│   └── Composer (Input Component)
│       ├── Textarea (Auto-resize)
│       └── SendButton (Material Icon)
└── MarkdownRenderer (Utility)
```

### File Structure

```
/
├── index.html                 # Single-page application entry
├── css/
│   └── style.css             # All styles including responsive breakpoints
├── js/
│   └── chat.js               # All JavaScript logic
├── assets/
│   └── img/
│       ├── theindiacore.png  # Logo (existing)
│       └── theindiacore.ico  # Favicon (existing)
└── README.md                 # Usage instructions
```

## Components and Interfaces

### 1. ChatController (Main Application Controller)

The ChatController is the central orchestrator initialized on DOM ready.

```javascript
class ChatController {
  constructor(options = {}) {
    this.messagesContainer = document.getElementById(options.messagesContainerId || 'messages');
    this.input = document.getElementById(options.inputId || 'input');
    this.sendBtn = document.getElementById(options.sendBtnId || 'sendBtn');
    this.logoSrc = options.logoSrc || '/assets/img/theindiacore.png';
    this.wordDelay = options.wordDelay || 100;
    this.punctuationPause = options.punctuationPause || 250;
    this.maxMessages = options.maxMessages || 200;
    this.messageCount = 0;
    this.isProcessing = false;
    
    this.init();
  }
  
  init() {
    // Attach event listeners
    // Setup auto-resize for textarea
    // Initialize markdown renderer
  }
  
  sendUserMessage(text) { }
  simulateBotReply(userText) { }
  createUserBubble(text) { }
  createBotBubble(text, options = {}) { }
  createErrorBubble(text) { }
  createTypingIndicator() { }
  removeTypingIndicator() { }
  animateBotReplyWordByWord(element, text) { }
  enableSend() { }
  disableSend() { }
  scrollToBottom(smooth = true) { }
  pruneOldMessages() { }
  renderMarkdown(text) { }
}
```

### 2. Message Bubble Components

#### UserBubble Structure
```html
<div class="bubble bubble-user" role="article" aria-label="You: [first 10 words]">
  <div class="bubble-content">
    <!-- Rendered markdown content -->
  </div>
  <span class="bubble-timestamp">HH:MM</span>
</div>
```

#### BotBubble Structure
```html
<div class="bubble bubble-bot" role="article" aria-label="Bot: [first 10 words]">
  <img src="/assets/img/theindiacore.png" alt="IndiaCore" class="bubble-avatar">
  <div class="bubble-content">
    <!-- Rendered markdown content (animated word-by-word) -->
  </div>
  <span class="bubble-timestamp">HH:MM</span>
</div>
```

#### ErrorBubble Structure
```html
<div class="bubble bubble-error" role="status" aria-label="Error: [message]">
  <img src="/assets/img/theindiacore.png" alt="IndiaCore" class="bubble-avatar">
  <span class="material-icons error-icon">error_outline</span>
  <div class="bubble-content">
    <!-- Error message -->
  </div>
</div>
```

#### TypingIndicator Structure
```html
<div class="bubble typing-indicator" aria-label="Bot is typing" aria-live="polite">
  <img src="/assets/img/theindiacore.png" alt="IndiaCore" class="bubble-avatar">
  <div class="typing-dots">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</div>
```

### 3. Composer Component

The composer handles user input with auto-resize and keyboard shortcuts.

```javascript
class ComposerManager {
  constructor(textarea, sendBtn, onSend) {
    this.textarea = textarea;
    this.sendBtn = sendBtn;
    this.onSend = onSend;
    this.maxRows = 5;
    this.lineHeight = 24; // pixels
    
    this.attachListeners();
  }
  
  attachListeners() {
    // Input event for auto-resize and send button state
    // Keydown for Enter/Shift+Enter handling
  }
  
  autoResize() {
    // Calculate rows based on scrollHeight
    // Apply max height constraint
  }
  
  reset() {
    // Clear textarea and reset height
  }
  
  enable() { }
  disable() { }
  getValue() { }
  focus() { }
}
```

### 4. Markdown Renderer

Uses `marked.js` (CDN) with `DOMPurify` (CDN) for safe rendering.

```javascript
class MarkdownRenderer {
  constructor() {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false
    });
  }
  
  render(text) {
    const rawHtml = marked.parse(text);
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
  }
}
```

## Data Models

### Message Object
```javascript
{
  id: String,              // Unique identifier (timestamp-based)
  type: 'user' | 'bot' | 'error' | 'system',
  text: String,            // Raw message text
  html: String,            // Rendered markdown HTML
  timestamp: Date,
  animated: Boolean        // For bot messages - tracks animation completion
}
```

### Dummy Response Map
```javascript
const DUMMY_REPLIES = {
  'hello': {
    type: 'bot',
    text: "Hi! I'm the IndiaCore assistant. How can I help you today?"
  },
  'show features': {
    type: 'bot',
    text: `I can:\n\n- Answer queries\n- Render **Markdown**\n- Simulate typing and reply word-by-word.\n\n_Ask anything!_`
  },
  'error test': {
    type: 'error',
    text: "Sorry — something went wrong while fetching your request. Please try again."
  },
  'markdown test': {
    type: 'bot',
    text: `Here is a list:\n\n- Item 1\n- **Bold item**\n- \`inline code\`\n\n\`\`\`js\nconsole.log('code block')\n\`\`\``
  },
  '_default': {
    type: 'bot',
    text: "I received your message: \"{input}\". This is a demo chatbot with simulated responses."
  }
};
```

## CSS Architecture

### Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colors */
  --bg: #ffffff;
  --card-bg: #f8faf8;
  --accent: #6fcf4f;
  --accent-2: #2e7d32;
  --muted: #9aa2a6;
  --text: #0f1720;
  --bubble-user: #e6f7e6;
  --bubble-bot: #ffffff;
  --error-bg: #fff3f3;
  --error-text: #c62828;
  
  /* Layout */
  --max-width-pc: 1100px;
  --header-width-pc: 80%;
  --content-width-pc: 65%;
  --radius: 14px;
  --shadow: 0 6px 18px rgba(12, 16, 20, 0.06);
  
  /* Typography */
  --font-family: 'Roboto', system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --line-height: 1.5;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 20px;
  --spacing-xl: 24px;
  
  /* Animation */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

### Layout System

#### Page Layout (Flexbox)
```css
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: var(--bg);
  margin: 0;
  padding: 0;
}

.top-header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md) 0;
}

.header-card {
  width: var(--header-width-pc);
  max-width: var(--max-width-pc);
  /* Card styling */
}

.chat-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-md);
}

.chat-card {
  width: var(--content-width-pc);
  max-width: var(--max-width-pc);
  display: flex;
  flex-direction: column;
  height: 100%;
}
```

#### Message Container (Scrollable)
```css
.messages {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--accent) transparent;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 3px;
}
```

#### Responsive Breakpoints
```css
@media (max-width: 768px) {
  .header-card,
  .chat-card {
    width: 100%;
  }
  
  .composer textarea {
    font-size: 16px; /* Prevent iOS zoom */
  }
}
```

### Bubble Styling with Tail

```css
.bubble {
  position: relative;
  max-width: 75%;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius);
  word-wrap: break-word;
}

.bubble-user {
  align-self: flex-end;
  background: var(--bubble-user);
  color: var(--text);
}

.bubble-user::after {
  content: '';
  position: absolute;
  right: -8px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-left: 8px solid var(--bubble-user);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.bubble-bot {
  align-self: flex-start;
  background: var(--bubble-bot);
  box-shadow: var(--shadow);
  display: flex;
  gap: var(--spacing-sm);
}

.bubble-bot::before {
  content: '';
  position: absolute;
  left: -8px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-right: 8px solid var(--bubble-bot);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}
```

### Animation Keyframes

#### Typing Dots Animation
```css
@keyframes dot-jump {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.typing-dots .dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-2);
  animation: dot-jump 1.4s infinite;
}

.typing-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}
```

## Error Handling

### Input Validation
- Trim whitespace before processing
- Reject empty messages
- Limit message length to 2000 characters (client-side)
- Sanitize all user input before rendering

### XSS Prevention
- Use DOMPurify to sanitize all markdown-rendered HTML
- Never use `innerHTML` with unsanitized content
- Set `rel="noopener noreferrer"` on all external links

### Graceful Degradation
- If marked.js fails to load, display plain text
- If DOMPurify fails to load, escape HTML entities manually
- If Material Icons fail to load, use Unicode fallback (✉ for send)

### Error States
- Network errors: Not applicable (no network calls)
- Rendering errors: Catch and display error bubble
- Animation errors: Fall back to instant display

## Testing Strategy

### Manual Testing Checklist

#### Visual & Layout Tests
1. Header card centered with logo and title side-by-side
2. Chat card and composer widths match on desktop (65%) and mobile (100%)
3. Message container stretches with viewport height changes
4. Custom scrollbar visible and styled correctly
5. All border-radius and shadows applied correctly

#### Interaction Tests
1. Send button disabled when textarea empty/whitespace-only
2. Send button enabled when textarea has content
3. Enter key sends message (without Shift)
4. Shift+Enter creates newline
5. Textarea auto-resizes up to 5 rows
6. Send button and textarea disabled during bot reply
7. Focus returns to textarea after bot reply completes

#### Animation Tests
1. Typing indicator appears with logo and jumping dots
2. Typing indicator displays for 600-1400ms
3. Bot reply animates word-by-word at ~100ms per word
4. Punctuation adds 250ms pause
5. Smooth scroll to bottom after each message

#### Content Tests
1. "hello" → greeting response
2. "show features" → markdown list with bold/italic
3. "error test" → error bubble with red background
4. "markdown test" → lists, code blocks, inline code render correctly
5. User messages render markdown correctly
6. Links open in new tab with noopener

#### Accessibility Tests
1. aria-live="polite" on messages container
2. aria-label on send button and textarea
3. role="article" on message bubbles
4. role="status" on error bubbles
5. Keyboard navigation works (Tab, Enter, Shift+Enter)
6. Color contrast meets WCAG AA (4.5:1 minimum)
7. Screen reader announces new messages

#### Performance Tests
1. Page loads in <500ms
2. Animations run at 60fps
3. Message pruning works (max 200 messages)
4. No memory leaks after 100+ messages
5. Smooth scrolling performance

### Browser Compatibility

Target browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Automated Testing (Optional Future Enhancement)

While not required for initial delivery, the code structure supports:
- Unit tests for ChatController methods
- Integration tests for message flow
- Visual regression tests with Percy/Chromatic
- Accessibility tests with axe-core

## Performance Considerations

### Bundle Size Budget
- HTML: ~3KB
- CSS: ~8KB
- JavaScript: ~12KB
- Total (excluding CDN libs): ~23KB
- marked.js (CDN): ~50KB
- DOMPurify (CDN): ~20KB

### Optimization Strategies
1. Use CSS transforms for animations (GPU-accelerated)
2. Debounce textarea resize calculations
3. Use `requestAnimationFrame` for word-by-word animation
4. Prune messages beyond 200 to prevent DOM bloat
5. Lazy-load Material Icons font

### Memory Management
- Remove old message DOM nodes when exceeding 200 messages
- Clear animation timeouts on component destruction
- Use event delegation where possible

## Security Considerations

### XSS Prevention
- All user input sanitized through DOMPurify
- Markdown rendering uses allowlist approach
- No `eval()` or `Function()` constructors
- CSP headers recommended (if served via web server)

### Content Security Policy (Recommended)
```
Content-Security-Policy: 
  default-src 'self'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  script-src 'self' https://cdn.jsdelivr.net; 
  img-src 'self' data:;
```

## Future Enhancements (Out of Scope)

1. **LocalStorage Persistence**: Save conversation history
2. **Theme Toggle**: Light/dark mode switcher
3. **Quick Reply Chips**: Predefined response buttons
4. **Voice Input**: Web Speech API integration
5. **Export Chat**: Download conversation as text/PDF
6. **Typing Detection**: Show "User is typing..." to simulate real chat
7. **Message Reactions**: Emoji reactions to bot messages
8. **Search**: Find messages in conversation history

## Implementation Notes

### CDN Resources
```html
<!-- Markdown Parser -->
<script src="https://cdn.jsdelivr.net/npm/marked@11.0.0/marked.min.js"></script>

<!-- HTML Sanitizer -->
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>

<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Roboto Font -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
```

### Initialization
```javascript
// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.chatController = new ChatController({
    messagesContainerId: 'messages',
    inputId: 'input',
    sendBtnId: 'sendBtn',
    logoSrc: '/assets/img/theindiacore.png',
    wordDelay: 100,
    punctuationPause: 250,
    maxMessages: 200
  });
});
```

This design provides a complete blueprint for implementing the theIndiaCore chatbot with all requirements satisfied, maintaining simplicity while delivering a polished user experience.
