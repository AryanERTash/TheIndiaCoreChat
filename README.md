# TheIndiaCore Chatbot

A lightweight, single-page chatbot interface for theIndiaCore.in featuring a clean design with lime-green accents, smooth animations, and full markdown support.

## Features

- **Zero Dependencies**: No npm, no build step, no server required - just open `index.html` in your browser
- **Responsive Design**: Fluid layouts that adapt from mobile (320px) to desktop (4K displays)
- **Markdown Support**: Full markdown rendering including lists, bold, italic, code blocks, and links
- **Smooth Animations**: Word-by-word bot reply animation with typing indicator
- **Accessibility First**: WCAG 2.1 AA compliant with semantic HTML and ARIA attributes
- **Custom Styling**: Branded color scheme with custom scrollbars and speech bubble tails
- **Keyboard Navigation**: Full keyboard support with Enter to send, Shift+Enter for newlines

## Quick Start

1. **Clone or download** this repository
2. **Open** `index.html` in any modern web browser
3. **Start chatting** - type a message and press Enter or click the send button

That's it! No installation, no configuration, no server setup required.

## Architecture

This chatbot is built entirely with vanilla HTML, CSS, and JavaScript:

- **HTML**: Semantic HTML5 structure with accessibility attributes
- **CSS**: Custom properties (CSS variables) for theming, flexbox layouts, custom animations
- **JavaScript**: ES6+ vanilla JavaScript with no frameworks or build tools
- **CDN Libraries**: 
  - [marked.js](https://marked.js.org/) - Markdown parsing
  - [DOMPurify](https://github.com/cure53/DOMPurify) - HTML sanitization
  - [Material Icons](https://fonts.google.com/icons) - Icon font
  - [Roboto Font](https://fonts.google.com/specimen/Roboto) - Typography

## Project Structure

```
/
├── index.html              # Main application entry point
├── assets/
│   ├── css/
│   │   └── style.css      # All styles and responsive breakpoints
│   ├── js/
│   │   └── chat.js        # ChatController and application logic
│   └── img/
│       ├── theindiacore.png  # Logo image
│       └── theindiacore.ico  # Favicon
└── README.md              # This file
```

## Test Keywords

The chatbot includes predefined responses for testing different features:

| Keyword | Response Type | Description |
|---------|---------------|-------------|
| `hello` | Greeting | Returns a friendly welcome message |
| `show features` | Markdown List | Displays chatbot capabilities with formatted list |
| `error test` | Error Bubble | Triggers an error message with red styling |
| `markdown test` | Rich Markdown | Demonstrates lists, bold text, inline code, and code blocks |
| *Any other text* | Echo Response | Returns a default acknowledgment with your message |

### Example Test Flow

1. Type `hello` and press Enter
   - User bubble appears on the right with green background
   - Typing indicator shows with jumping dots
   - Bot reply animates word-by-word on the left

2. Type `show features` and press Enter
   - Bot responds with a markdown-formatted list of capabilities

3. Type `error test` and press Enter
   - Error bubble appears with pale red background and error icon

4. Type `markdown test` and press Enter
   - Bot demonstrates various markdown features including code blocks

## Browser Support

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support including custom scrollbars |
| Edge | 90+ | Full support including custom scrollbars |
| Firefox | 88+ | Full support with thin scrollbar styling |
| Safari | 14+ | Full support on macOS and iOS |
| Chrome Mobile | Android 10+ | Optimized for touch with 16px font to prevent zoom |
| Safari Mobile | iOS 14+ | Optimized for touch with 16px font to prevent zoom |

### Browser Features Used

- CSS Custom Properties (CSS Variables)
- Flexbox Layout
- CSS Grid (minimal usage)
- ES6+ JavaScript (arrow functions, classes, template literals)
- `requestAnimationFrame` for smooth animations
- Custom scrollbar styling (WebKit and Firefox)

## Accessibility Features

This chatbot is built with accessibility as a core principle:

- **Screen Reader Support**: 
  - `aria-live="polite"` on message container for announcements
  - `aria-label` attributes on all interactive elements
  - `role="article"` on message bubbles
  - `role="status"` on error messages

- **Keyboard Navigation**:
  - Tab key moves focus between textarea and send button
  - Enter key sends message
  - Shift+Enter creates newline in textarea
  - Send button operable with Enter/Space keys
  - Focus returns to textarea after message sent

- **Color Contrast**:
  - All text meets WCAG AA standard (4.5:1 minimum contrast ratio)
  - User bubbles: dark text on light green background
  - Bot bubbles: dark text on white background
  - Error bubbles: dark red text on pale red background

- **Semantic HTML**:
  - Proper heading hierarchy
  - Semantic elements (`<header>`, `<main>`, `<section>`)
  - Alt text on all images

## Customization

### Changing Colors

Edit the CSS custom properties in `assets/css/style.css`:

```css
:root {
  --bg: #ffffff;              /* Page background */
  --accent: #6fcf4f;          /* Lime-green accent */
  --accent-2: #2e7d32;        /* Darker green */
  --bubble-user: #e6f7e6;     /* User message background */
  --bubble-bot: #ffffff;      /* Bot message background */
  --error-bg: #fff3f3;        /* Error message background */
  --text: #0f1720;            /* Primary text color */
}
```

### Adjusting Animation Speed

Edit the ChatController initialization in `assets/js/chat.js`:

```javascript
window.chatController = new ChatController({
  wordDelay: 100,           // Milliseconds between words (default: 100)
  punctuationPause: 250,    // Extra pause after punctuation (default: 250)
  maxMessages: 200          // Maximum messages before pruning (default: 200)
});
```

### Adding Custom Responses

Edit the `DUMMY_REPLIES` object in `assets/js/chat.js`:

```javascript
const DUMMY_REPLIES = {
  'your keyword': {
    type: 'bot',  // or 'error'
    text: 'Your response text with **markdown** support'
  }
};
```

## Troubleshooting

### Issue: Chatbot doesn't load or shows blank page

**Solution**: 
- Ensure you're opening `index.html` directly in a browser (not viewing the HTML source)
- Check browser console (F12) for JavaScript errors
- Verify CDN resources are loading (check Network tab in DevTools)
- Try a different browser or clear browser cache

### Issue: Markdown not rendering

**Solution**:
- Check that marked.js CDN is loading (view Network tab in browser DevTools)
- Verify internet connection (CDN libraries require internet access)
- Check browser console for errors related to `marked` or `DOMPurify`

### Issue: Custom scrollbar not visible

**Solution**:
- Custom scrollbars only work in WebKit browsers (Chrome, Edge, Safari)
- Firefox uses `scrollbar-width: thin` which provides a thinner default scrollbar
- Ensure `.messages` container has enough content to scroll

### Issue: Send button stays disabled

**Solution**:
- Ensure textarea contains non-whitespace characters
- Check browser console for JavaScript errors
- Try refreshing the page
- Verify that event listeners are attached (check `init()` method in chat.js)

### Issue: Typing indicator doesn't appear

**Solution**:
- Check that `theindiacore.png` exists in `assets/img/` directory
- Verify the logo path in ChatController initialization
- Check browser console for 404 errors on image loading
- Ensure CSS animations are enabled in browser settings

### Issue: Mobile layout issues

**Solution**:
- Verify viewport meta tag is present in `index.html`
- Test on actual device rather than browser DevTools (some features differ)
- Check that responsive breakpoint is set to 768px in CSS
- Ensure textarea font-size is 16px on mobile to prevent iOS zoom

### Issue: Messages not scrolling to bottom

**Solution**:
- Check that `.messages` container has `overflow-y: auto`
- Verify `scrollToBottom()` method is being called after message append
- Try disabling smooth scrolling: change `behavior: 'smooth'` to `behavior: 'auto'`
- Check for CSS conflicts with `overflow` or `height` properties

### Issue: Word-by-word animation is too fast/slow

**Solution**:
- Adjust `wordDelay` parameter in ChatController initialization
- Modify `punctuationPause` for longer pauses after punctuation
- Check that `requestAnimationFrame` is supported in your browser

### Issue: Keyboard shortcuts not working

**Solution**:
- Ensure textarea has focus (click inside it)
- Check that event listeners are attached (view console for errors)
- Verify no browser extensions are intercepting keyboard events
- Try in incognito/private mode to rule out extension conflicts

## Performance Notes

- **Bundle Size**: ~23KB (HTML + CSS + JS), plus ~70KB from CDN libraries
- **Load Time**: Typically <500ms on modern connections
- **Memory Management**: Automatically prunes messages beyond 200 to prevent DOM bloat
- **Animation Performance**: Uses `requestAnimationFrame` for 60fps animations
- **Scrolling**: GPU-accelerated with CSS transforms

## Security

- **XSS Prevention**: All user input and markdown output sanitized with DOMPurify
- **Content Security**: No `eval()` or `Function()` constructors used
- **Link Safety**: External links open with `rel="noopener noreferrer"`
- **Input Validation**: Client-side validation for message length and content

## Future Enhancements

Potential features for future versions (not currently implemented):

- LocalStorage persistence for conversation history
- Light/dark theme toggle
- Quick reply chips for common questions
- Voice input via Web Speech API
- Export conversation as text/PDF
- Message search functionality
- Emoji reactions to messages
- Real backend integration

## License

This project is part of theIndiaCore.in. All rights reserved.

## Support

For issues or questions:
- Check the Troubleshooting section above
- Review browser console for error messages
- Ensure you're using a supported browser version
- Verify all files are in the correct directory structure

---

**Built with ❤️ for theIndiaCore.in**
