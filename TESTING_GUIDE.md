# Testing Guide - TheIndiaCore Chatbot

This guide explains how to run all tests for the TheIndiaCore Chatbot.

---

## Quick Start

### 1. Start Local Server

```bash
python3 -m http.server 8080
```

Or use any other local server:
```bash
# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

### 2. Open the Chatbot

Navigate to: http://localhost:8080/index.html

### 3. Run Automated Tests

Navigate to: http://localhost:8080/test-chatbot.html

Click "Run All Tests" to execute the automated test suite.

---

## Test Scripts

### Implementation Verification

Verifies that all required code elements exist:

```bash
node verify-implementation.js
```

**Expected Output**: 99/102 tests passed (97.1%)

### Color Contrast Check

Verifies WCAG AA compliance:

```bash
node check-contrast.js
```

**Expected Output**: 6/6 tests passed (100%)

---

## Manual Testing

### User Flow Testing

1. Open http://localhost:8080/index.html
2. Test each keyword:
   - Type "hello" → Verify greeting response
   - Type "show features" → Verify markdown list
   - Type "error test" → Verify error bubble
   - Type "markdown test" → Verify all markdown features
3. Test long messages and scrolling

### Responsive Testing

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test viewports:
   - Desktop: 1920x1080 (header 80%, chat 65%)
   - Tablet: 768x1024 (breakpoint behavior)
   - Mobile: 375x667 (100% width, 16px padding)

### Keyboard Testing

1. Use Tab to navigate to textarea
2. Type a message
3. Press Enter (without Shift) → Message sends
4. Type a message
5. Press Shift+Enter → Newline added
6. Verify focus returns to textarea after bot reply

### Accessibility Testing

1. Open browser DevTools
2. Inspect elements for ARIA attributes:
   - Messages container: aria-live="polite"
   - Textarea: aria-label="Message input"
   - Send button: aria-label="Send"
3. Test with screen reader (optional):
   - Windows: NVDA or JAWS
   - macOS: VoiceOver (Cmd+F5)
   - Verify announcements work

---

## Test Checklists

### Complete Checklist
See `TESTING_CHECKLIST.md` for a comprehensive manual testing checklist.

### Browser Testing
See `CROSS_BROWSER_REPORT.md` for browser compatibility details.

---

## Test Results

All test results are documented in:
- **TEST_SUMMARY.md** - Comprehensive test summary
- **CROSS_BROWSER_REPORT.md** - Browser compatibility report

---

## Test Keywords

Use these keywords to test different responses:

| Keyword | Expected Response |
|---------|-------------------|
| `hello` | Greeting message |
| `show features` | Markdown list of capabilities |
| `error test` | Error bubble with red background |
| `markdown test` | Comprehensive markdown demo |
| Any other text | Default echo response |

---

## Troubleshooting

### Tests Not Running

**Problem**: Automated tests show errors  
**Solution**: Ensure local server is running on port 8080

**Problem**: CDN resources not loading  
**Solution**: Check internet connection (marked.js and DOMPurify are from CDN)

### Visual Issues

**Problem**: Scrollbar not styled  
**Solution**: Check browser (WebKit for Chrome/Safari, scrollbar-width for Firefox)

**Problem**: Animations not smooth  
**Solution**: Check browser performance, close other tabs

### Accessibility Issues

**Problem**: Screen reader not announcing  
**Solution**: Ensure aria-live="polite" is on messages container

---

## Success Criteria

All tests should pass with these results:

- ✅ Implementation verification: 97%+ pass rate
- ✅ Color contrast: 100% WCAG AA compliant
- ✅ User flow: All keywords work correctly
- ✅ Responsive: All breakpoints functional
- ✅ Animations: Smooth 60 FPS performance
- ✅ Accessibility: All ARIA attributes present
- ✅ Cross-browser: Works in Chrome, Firefox, Safari, Edge

---

## Contact

For questions or issues with testing, refer to:
- Design document: `.kiro/specs/theindiacore-chatbot/design.md`
- Requirements: `.kiro/specs/theindiacore-chatbot/requirements.md`
- Tasks: `.kiro/specs/theindiacore-chatbot/tasks.md`

---

**Last Updated**: 2025-11-15  
**Status**: All tests passing ✅
