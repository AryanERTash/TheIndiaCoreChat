# TheIndiaCore Chatbot - Testing Checklist

## Test Environment
- **Test URL**: http://localhost:8080/index.html
- **Automated Tests**: http://localhost:8080/test-chatbot.html
- **Date**: 2025-11-15

---

## 10.1 Complete User Flow Tests ✓

### Test 1: Hello Message (Requirement 12.1)
- [ ] Open index.html in browser
- [ ] Type "hello" in the textarea
- [ ] Click send button or press Enter
- [ ] **Expected**: Bot responds with "Hi! I'm the IndiaCore assistant. How can I help you today?"
- [ ] **Result**: ___________

### Test 2: Show Features (Requirement 12.2)
- [ ] Type "show features" in the textarea
- [ ] Send the message
- [ ] **Expected**: Bot responds with markdown-formatted list of capabilities
- [ ] Verify markdown rendering: bold text, italic text, bullet points
- [ ] **Result**: ___________

### Test 3: Error Test (Requirement 12.3)
- [ ] Type "error test" in the textarea
- [ ] Send the message
- [ ] **Expected**: Error bubble appears with pale red background
- [ ] Verify error icon is displayed
- [ ] Verify error message text is shown
- [ ] **Result**: ___________

### Test 4: Markdown Test (Requirement 12.4)
- [ ] Type "markdown test" in the textarea
- [ ] Send the message
- [ ] **Expected**: Bot responds with comprehensive markdown demo
- [ ] Verify lists render correctly
- [ ] Verify **bold text** renders correctly
- [ ] Verify `inline code` renders correctly
- [ ] Verify code blocks render correctly with proper formatting
- [ ] **Result**: ___________

### Test 5: Long Messages and Scrolling
- [ ] Type a very long message (200+ characters)
- [ ] Send the message
- [ ] **Expected**: Message container scrolls smoothly to show new message
- [ ] Verify scrollbar appears when content exceeds container height
- [ ] Verify custom scrollbar styling (thin, green thumb)
- [ ] **Result**: ___________

### Test 6: Default Response
- [ ] Type any unrecognized message (e.g., "random text")
- [ ] Send the message
- [ ] **Expected**: Bot responds with default message echoing user input
- [ ] **Result**: ___________

---

## 10.2 Responsive Behavior Tests ✓

### Test 1: Desktop Viewport (>768px) (Requirements 2.1, 2.2)
- [ ] Set browser width to 1200px or larger
- [ ] **Expected**: Header card width is 80% of viewport (max 1100px)
- [ ] **Expected**: Chat card width is 65% of viewport (max 1100px)
- [ ] Verify both cards are centered horizontally
- [ ] Verify proper spacing and padding
- [ ] **Result**: ___________

### Test 2: Mobile Viewport (<768px) (Requirement 2.3)
- [ ] Set browser width to 375px (mobile size)
- [ ] **Expected**: Header card width is 100% with 16px padding
- [ ] **Expected**: Chat card width is 100% with 16px padding
- [ ] Verify textarea font-size is 16px (prevents iOS zoom)
- [ ] Verify message bubbles are max 85-90% width
- [ ] **Result**: ___________

### Test 3: Tablet Viewport (768px) (Requirement 2.3)
- [ ] Set browser width to exactly 768px
- [ ] Verify breakpoint behavior transitions correctly
- [ ] **Expected**: Layout switches between desktop and mobile styles
- [ ] **Result**: ___________

### Test 4: Vertical Stretching (Requirement 2.4)
- [ ] Resize browser height from 600px to 1000px
- [ ] **Expected**: Message container expands vertically to fill space
- [ ] Verify header stays at top
- [ ] Verify composer stays at bottom
- [ ] **Result**: ___________

---

## 10.3 Animations and Interactions Tests ✓

### Test 1: Typing Indicator (Requirements 5.1, 5.2, 5.3)
- [ ] Send any message
- [ ] **Expected**: Typing indicator appears immediately
- [ ] Verify company logo is displayed on left
- [ ] Verify three dots are displayed
- [ ] Verify dots animate in jumping wave pattern
- [ ] Verify indicator displays for 600-1400ms
- [ ] Verify indicator is removed before bot response appears
- [ ] **Result**: ___________

### Test 2: Word-by-Word Animation (Requirement 5.5)
- [ ] Send "show features" message
- [ ] **Expected**: Bot response animates word-by-word
- [ ] Verify timing is approximately 100ms per word
- [ ] Verify punctuation adds 250ms pause
- [ ] Verify animation is smooth and readable
- [ ] **Result**: ___________

### Test 3: Smooth Scrolling (Requirement 7.1)
- [ ] Send multiple messages to fill the container
- [ ] **Expected**: Container scrolls smoothly to bottom after each message
- [ ] Verify scroll behavior is smooth, not instant
- [ ] **Result**: ___________

### Test 4: Send Button State (Requirements 7.1, 7.2)
- [ ] Type a message
- [ ] Click send
- [ ] **Expected**: Send button is disabled during bot reply
- [ ] **Expected**: Textarea is disabled during bot reply
- [ ] Wait for bot response to complete
- [ ] **Expected**: Send button is re-enabled
- [ ] **Expected**: Textarea is re-enabled and focused
- [ ] **Result**: ___________

### Test 5: Textarea Auto-Resize (Requirements 11.1, 11.2)
- [ ] Type a single line of text
- [ ] **Expected**: Textarea height is minimal (1 row)
- [ ] Press Enter multiple times to create 6+ lines
- [ ] **Expected**: Textarea expands up to 5 rows
- [ ] **Expected**: After 5 rows, vertical scrollbar appears in textarea
- [ ] Delete lines to reduce content
- [ ] **Expected**: Textarea shrinks back down
- [ ] **Result**: ___________

### Test 6: Keyboard Shortcuts (Requirements 3.5, 3.6)
- [ ] Type a message
- [ ] Press Enter (without Shift)
- [ ] **Expected**: Message is sent, no newline is added
- [ ] Type a message
- [ ] Press Shift+Enter
- [ ] **Expected**: Newline is added, message is not sent
- [ ] **Result**: ___________

---

## 10.4 Accessibility Features Tests ✓

### Test 1: ARIA Attributes (Requirements 10.1, 10.2, 10.3)
- [ ] Open browser DevTools
- [ ] Inspect messages container
- [ ] **Expected**: Has aria-live="polite" attribute
- [ ] Inspect textarea
- [ ] **Expected**: Has aria-label="Message input" attribute
- [ ] Inspect send button
- [ ] **Expected**: Has aria-label="Send" attribute
- [ ] Inspect message bubbles
- [ ] **Expected**: User bubbles have role="article"
- [ ] **Expected**: Error bubbles have role="status"
- [ ] **Result**: ___________

### Test 2: Screen Reader Testing (Requirement 10.1)
- [ ] Enable screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Navigate to chatbot
- [ ] Send a message
- [ ] **Expected**: Screen reader announces new messages
- [ ] **Expected**: aria-live region updates are announced
- [ ] **Result**: ___________

### Test 3: Keyboard Navigation (Requirements 10.5, 3.5, 3.6)
- [ ] Use only keyboard (no mouse)
- [ ] Press Tab to navigate to textarea
- [ ] **Expected**: Textarea receives focus with visible outline
- [ ] Type a message
- [ ] Press Tab to navigate to send button
- [ ] **Expected**: Send button receives focus
- [ ] Press Enter or Space
- [ ] **Expected**: Message is sent
- [ ] **Expected**: Focus returns to textarea after bot reply
- [ ] **Result**: ___________

### Test 4: Color Contrast (Requirement 10.4)
- [ ] Use contrast checker tool (e.g., WebAIM Contrast Checker)
- [ ] Check text color (#0f1720) against white background (#ffffff)
- [ ] **Expected**: Contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Check user bubble text against light green background (#e6f7e6)
- [ ] **Expected**: Contrast ratio ≥ 4.5:1
- [ ] Check error text against pale red background (#fff3f3)
- [ ] **Expected**: Contrast ratio ≥ 4.5:1
- [ ] **Result**: ___________

### Test 5: Focus Management (Requirement 10.5)
- [ ] Send a message
- [ ] Observe focus during bot reply
- [ ] **Expected**: Focus remains on textarea (disabled state)
- [ ] Wait for bot reply to complete
- [ ] **Expected**: Focus returns to textarea (enabled state)
- [ ] **Expected**: User can immediately start typing
- [ ] **Result**: ___________

---

## 10.5 Cross-Browser Testing ✓

### Test 1: Chrome/Edge (Latest)
- [ ] Open in Chrome or Edge
- [ ] Run all user flow tests
- [ ] Verify custom scrollbar styling (WebKit)
- [ ] Verify all animations work smoothly
- [ ] Verify markdown rendering
- [ ] **Result**: ___________

### Test 2: Firefox (Latest)
- [ ] Open in Firefox
- [ ] Run all user flow tests
- [ ] Verify scrollbar-width: thin works
- [ ] Verify scrollbar-color styling
- [ ] Verify all animations work smoothly
- [ ] Verify markdown rendering
- [ ] **Result**: ___________

### Test 3: Safari (Latest)
- [ ] Open in Safari
- [ ] Run all user flow tests
- [ ] Verify custom scrollbar styling (WebKit)
- [ ] Verify all animations work smoothly
- [ ] Verify markdown rendering
- [ ] **Result**: ___________

### Test 4: Mobile Safari (iOS)
- [ ] Open on iPhone/iPad
- [ ] Verify responsive layout (100% width)
- [ ] Verify textarea font-size is 16px (no zoom)
- [ ] Test touch interactions
- [ ] Verify scrolling works smoothly
- [ ] **Result**: ___________

### Test 5: Chrome Mobile (Android)
- [ ] Open on Android device
- [ ] Verify responsive layout (100% width)
- [ ] Test touch interactions
- [ ] Verify scrolling works smoothly
- [ ] Verify all functionality works
- [ ] **Result**: ___________

---

## Additional Verification

### Performance Tests
- [ ] Page loads in < 500ms
- [ ] Animations run at 60fps
- [ ] No memory leaks after 100+ messages
- [ ] Message pruning works (max 200 messages)

### Security Tests
- [ ] Try XSS attack: `<script>alert('xss')</script>`
- [ ] **Expected**: Script is sanitized and not executed
- [ ] Try HTML injection: `<img src=x onerror=alert('xss')>`
- [ ] **Expected**: HTML is sanitized
- [ ] Verify all links have target="_blank" and rel="noopener noreferrer"

### Edge Cases
- [ ] Send empty message (whitespace only)
- [ ] **Expected**: Send button remains disabled
- [ ] Send very long message (2000+ characters)
- [ ] **Expected**: Alert or truncation
- [ ] Rapid clicking send button
- [ ] **Expected**: Only one message sent at a time
- [ ] Resize window while bot is typing
- [ ] **Expected**: Layout adapts without breaking

---

## Test Summary

**Total Tests**: ___________
**Passed**: ___________
**Failed**: ___________
**Blocked**: ___________

**Overall Status**: ☐ PASS ☐ FAIL

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

**Tested By**: ___________
**Date**: ___________
**Browser/Device**: ___________
