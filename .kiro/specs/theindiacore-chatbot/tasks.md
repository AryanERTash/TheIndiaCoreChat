# Implementation Plan

- [x] 1. Create HTML structure and integrate CDN dependencies
  - Create `index.html` with semantic HTML5 structure
  - Add CDN links for marked.js, DOMPurify, Material Icons, and Roboto font
  - Implement header card with logo and title side-by-side
  - Implement chat card with messages container and composer
  - Add favicon reference to theindiacore.ico
  - Include proper meta tags for viewport and charset
  - _Requirements: 1.1, 1.3, 3.1, 3.2_

- [x] 2. Implement CSS design system and layout
  - [x] 2.1 Create CSS custom properties for design tokens
    - Define color variables (--bg, --accent, --bubble-user, --bubble-bot, --error-bg, etc.)
    - Define layout variables (--max-width-pc, --header-width-pc, --content-width-pc, --radius, --shadow)
    - Define typography variables (--font-family, --font-size-base, --line-height)
    - Define spacing variables (--spacing-xs through --spacing-xl)
    - Define animation timing variables (--transition-fast, --transition-normal)
    - _Requirements: 1.2, 1.3, 1.4, 1.5_
  
  - [x] 2.2 Implement page layout with flexbox
    - Style body with flex column layout, min-height 100vh, centered alignment
    - Style header card with 80% width on desktop, max-width 1100px, centered
    - Style chat wrapper and chat card with 65% width on desktop, flex column layout
    - Ensure message container stretches vertically with flex: 1 1 auto
    - Position composer at bottom with sticky or fixed positioning
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  
  - [x] 2.3 Style message bubbles with speech bubble tails
    - Create base .bubble class with padding, border-radius, max-width 75%
    - Style .bubble-user with right alignment, light green background, tail on right
    - Style .bubble-bot with left alignment, white background, shadow, tail on left
    - Style .bubble-error with pale red background, error icon styling
    - Add .bubble-avatar styling for logo thumbnails in bot/error bubbles
    - Add .bubble-timestamp styling for time display
    - _Requirements: 4.2, 4.3, 6.4, 6.5, 8.1, 8.2, 8.3_
  
  - [x] 2.4 Implement custom scrollbar styling
    - Style .messages scrollbar for WebKit browsers (width, track, thumb with accent color)
    - Add scrollbar-width: thin and scrollbar-color for Firefox
    - Ensure overflow-y: auto and overflow-x: hidden on messages container
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 2.5 Create typing indicator animation
    - Define @keyframes dot-jump animation with translateY
    - Style .typing-dots with three .dot elements
    - Apply staggered animation-delay (0s, 0.2s, 0.4s) to dots
    - Style typing indicator bubble with logo and dots layout
    - _Requirements: 5.2, 5.3_
  
  - [x] 2.6 Implement responsive breakpoints
    - Add @media (max-width: 768px) for mobile layout
    - Set header-card and chat-card to 100% width with 16px padding on mobile
    - Set textarea font-size to 16px on mobile to prevent iOS zoom
    - Test layout on various viewport sizes
    - _Requirements: 2.3_

- [x] 3. Implement ChatController class and core functionality
  - [x] 3.1 Create ChatController constructor and initialization
    - Define constructor accepting options object (messagesContainerId, inputId, sendBtnId, logoSrc, wordDelay, etc.)
    - Store references to DOM elements (messagesContainer, input, sendBtn)
    - Initialize state variables (messageCount, isProcessing, maxMessages)
    - Call init() method to set up event listeners
    - _Requirements: 3.1, 3.2_
  
  - [x] 3.2 Implement ComposerManager for textarea auto-resize
    - Create ComposerManager class with textarea, sendBtn, and onSend callback
    - Implement autoResize() method calculating height based on scrollHeight
    - Limit textarea height to 5 rows (maxRows * lineHeight)
    - Enable vertical scrolling when content exceeds max height
    - Attach input event listener to trigger autoResize()
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 3.3 Implement keyboard event handling
    - Attach keydown listener to textarea for Enter and Shift+Enter
    - On Enter without Shift: prevent default, call sendUserMessage(), reset textarea
    - On Shift+Enter: allow default newline behavior
    - _Requirements: 3.5, 3.6_
  
  - [x] 3.4 Implement send button state management
    - Attach input event listener to textarea
    - Enable send button when textarea has non-whitespace content
    - Disable send button when textarea is empty or whitespace-only
    - Implement enableSend() and disableSend() methods
    - _Requirements: 3.3, 3.4_

- [x] 4. Implement message bubble creation methods
  - [x] 4.1 Implement createUserBubble() method
    - Create div with classes "bubble bubble-user"
    - Add role="article" and aria-label with first 10 words
    - Create bubble-content div and render markdown
    - Add timestamp span with current time (HH:MM format)
    - Return bubble element
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 4.2 Implement createBotBubble() method
    - Create div with classes "bubble bubble-bot"
    - Add role="article" and aria-label with first 10 words
    - Add img element with logoSrc and alt="IndiaCore"
    - Create bubble-content div (empty, to be filled by animation)
    - Add timestamp span
    - Return bubble element
    - _Requirements: 6.4, 6.5_
  
  - [x] 4.3 Implement createErrorBubble() method
    - Create div with classes "bubble bubble-error"
    - Add role="status" and aria-label with error message
    - Add img element with logoSrc
    - Add span with class "material-icons error-icon" containing "error_outline"
    - Create bubble-content div with error text
    - Return bubble element
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 4.4 Implement createTypingIndicator() method
    - Create div with classes "bubble typing-indicator"
    - Add aria-label="Bot is typing" and aria-live="polite"
    - Add img element with logoSrc
    - Create typing-dots div with three span.dot elements
    - Store reference as this.typingIndicator
    - Return typing indicator element
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 4.5 Implement removeTypingIndicator() method
    - Check if this.typingIndicator exists in DOM
    - Remove typing indicator element from messages container
    - Clear this.typingIndicator reference
    - _Requirements: 5.4_

- [x] 5. Implement MarkdownRenderer with sanitization
  - [x] 5.1 Create MarkdownRenderer class
    - Define constructor that configures marked.js options (breaks: true, gfm: true, headerIds: false)
    - Implement render(text) method that calls marked.parse()
    - Sanitize output with DOMPurify.sanitize() using allowlist
    - Set ALLOWED_TAGS: p, br, strong, em, code, pre, ul, ol, li, a, blockquote
    - Set ALLOWED_ATTR: href, target, rel, class
    - Return sanitized HTML string
    - _Requirements: 4.4, 6.1, 6.2, 6.3_
  
  - [x] 5.2 Add link target attribute handling
    - Configure DOMPurify to add target="_blank" to all links
    - Add rel="noopener noreferrer" to external links for security
    - Test with markdown containing links
    - _Requirements: 6.3_

- [x] 6. Implement message sending and bot reply flow
  - [x] 6.1 Implement sendUserMessage() method
    - Trim and validate input text (reject if empty or whitespace-only)
    - Check message length limit (2000 characters)
    - Create user bubble and append to messages container
    - Scroll to bottom smoothly
    - Clear and reset textarea
    - Disable send button and textarea
    - Set isProcessing flag to true
    - Call simulateBotReply() with user text
    - _Requirements: 4.1, 4.5, 7.1, 7.2, 11.4, 11.5_
  
  - [x] 6.2 Implement simulateBotReply() method
    - Look up response from DUMMY_REPLIES based on user text (case-insensitive)
    - Use '_default' response if no match found, replacing {input} placeholder
    - Create and append typing indicator
    - Scroll to bottom
    - Set random delay between 600-1400ms
    - After delay, remove typing indicator
    - Check response type (bot vs error)
    - Create appropriate bubble (bot or error)
    - Append bubble to messages container
    - If bot type, call animateBotReplyWordByWord()
    - If error type, display immediately and re-enable composer
    - _Requirements: 5.1, 5.4, 5.5, 8.5, 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 6.3 Implement animateBotReplyWordByWord() method
    - Split text into words preserving whitespace
    - Render full markdown to get complete HTML
    - Extract words from rendered HTML (handle HTML tags carefully)
    - Use requestAnimationFrame for smooth animation
    - Append words one by one to bubble-content div
    - Apply wordDelay (100ms) between words
    - Add punctuationPause (250ms) after punctuation marks (. ! ? , ;)
    - On completion, enable send button and textarea, focus textarea
    - Set isProcessing flag to false
    - _Requirements: 5.5, 7.3, 7.4, 7.5_

- [x] 7. Implement utility methods and accessibility features
  - [x] 7.1 Implement scrollToBottom() method
    - Get last message element in messages container
    - Call scrollIntoView({behavior: 'smooth', block: 'end'})
    - Handle case when container is empty
    - _Requirements: 4.5_
  
  - [x] 7.2 Implement pruneOldMessages() method
    - Check if messageCount exceeds maxMessages (200)
    - Remove oldest message elements from DOM until count is at limit
    - Update messageCount
    - _Requirements: 9.5_
  
  - [x] 7.3 Add ARIA attributes to messages container
    - Set aria-live="polite" on messages container
    - Set aria-label="Message input" on textarea
    - Set aria-label="Send" on send button
    - Ensure all bubbles have appropriate role and aria-label attributes
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 7.4 Verify color contrast ratios
    - Test text color against bubble backgrounds using contrast checker
    - Ensure all text meets WCAG AA standard (4.5:1 minimum)
    - Adjust colors if needed while maintaining brand identity
    - _Requirements: 10.4_
  
  - [x] 7.5 Test keyboard navigation
    - Verify Tab key moves focus to send button
    - Verify send button is operable with Enter/Space keys
    - Verify focus returns to textarea after message sent
    - Test with keyboard-only navigation (no mouse)
    - _Requirements: 10.5_

- [x] 8. Create DUMMY_REPLIES data and wire up responses
  - Define DUMMY_REPLIES object with test keywords
  - Add "hello" response: greeting message
  - Add "show features" response: markdown list with capabilities
  - Add "error test" response: error type with error message
  - Add "markdown test" response: comprehensive markdown demo (lists, bold, code, code blocks)
  - Add "_default" response: echo message with {input} placeholder
  - Implement case-insensitive keyword matching in simulateBotReply()
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 9. Create README.md with usage instructions
  - Document project overview and features
  - Explain zero-dependency, no-build-step architecture
  - Provide instructions to open index.html in browser
  - List supported browsers and versions
  - Document test keywords (hello, show features, error test, markdown test)
  - Include accessibility features
  - Add troubleshooting section for common issues

- [x] 10. Final integration and testing
  - [x] 10.1 Test complete user flow
    - Open index.html in browser
    - Send "hello" message and verify greeting response
    - Send "show features" and verify markdown rendering
    - Send "error test" and verify error bubble styling
    - Send "markdown test" and verify all markdown features
    - Test with long messages and verify scrolling
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [x] 10.2 Test responsive behavior
    - Test on desktop viewport (>768px) - verify 80% header, 65% chat widths
    - Test on mobile viewport (<768px) - verify 100% widths with padding
    - Test on tablet viewport (768px) - verify breakpoint behavior
    - Resize viewport and verify message container stretches vertically
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 10.3 Test animations and interactions
    - Verify typing indicator appears with jumping dots
    - Verify word-by-word animation timing (~100ms per word)
    - Verify punctuation pause (250ms)
    - Verify smooth scrolling to bottom
    - Verify send button disabled during bot reply
    - Verify textarea auto-resize up to 5 rows
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 7.1, 7.2, 11.1, 11.2_
  
  - [x] 10.4 Test accessibility features
    - Test with screen reader (verify aria-live announcements)
    - Test keyboard-only navigation (Tab, Enter, Shift+Enter)
    - Verify all interactive elements have proper labels
    - Check color contrast with automated tool
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 10.5 Cross-browser testing
    - Test in Chrome/Edge (latest)
    - Test in Firefox (latest)
    - Test in Safari (latest)
    - Test on mobile Safari (iOS)
    - Test on Chrome Mobile (Android)
    - Verify custom scrollbar styling in each browser
