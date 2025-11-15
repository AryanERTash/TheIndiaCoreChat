

1 — Summary / Goal

Build a single-page, frontend-only chatbot UI for https://theIndiaCore.in.
Must match the site’s font style and color feel (predominantly white with a green-lime accent). The page contains:

centered header (logo + title side-by-side inside a rounded card),

a responsive chat message box (scrollable region for conversation),

a bottom fixed text input row with send icon button (a flying email/compose icon),

custom CSS-styled scrollbar, and

full client-side JavaScript functions to create user/bot/error speech bubbles, typing indicator, and word-by-word bot reply animation.

No backend required. All chatbot responses are simulated/dummy for testing.

2 — Tech stack & libraries (client-side only)

Recommended (choose one approach):

Vanilla HTML/CSS/ES6 JavaScript (no build step) — preferred for simplest delivery.

Or optionally: React/Preact (via CDN) or Svelte/Alpine.js — only if you include via CDN or static bundling; no Node/server installation required.

Markdown rendering: use a client-side markdown lib (CDN) — e.g., marked.js or markdown-it — to render bot/user messages supporting Markdown.

Use Google Material Icons and Material font (via Google Fonts) for the compose icon and Material look.

No external JS required for animations (CSS transitions + small JS animation loops).

3 — Visual theme & tokens

Define CSS custom properties (replace colors with exact brand tokens if available):

:root{
  --bg: #ffffff;                /* page background - white */
  --card-bg: #f8faf8;           /* very light grey/green card */
  --accent: #6fcf4f;            /* lime-green accent (adjust to match site) */
  --accent-2: #2e7d32;          /* darker green for text/icons */
  --muted: #9aa2a6;             /* muted border / grey */
  --text: #0f1720;              /* primary text */
  --bubble-user: #e6f7e6;       /* user bubble background */
  --bubble-bot: #ffffff;        /* bot bubble background (white card) */
  --error-bg: #fff3f3;          /* error bubble background (light red) */
  --max-width-pc: 1100px;      /* max widths */
  --header-width-pc: 80%;      /* header width on desktop ~80% */
  --content-width-pc: 65%;     /* message box and input on desktop */
  --radius: 14px;
  --shadow: 0 6px 18px rgba(12,16,20,0.06);
  --font-family: 'Material Sans', 'Roboto', system-ui, -apple-system, "Segoe UI", sans-serif;
}


Note: If you want exact theIndiaCore.in tokens, replace --accent/fonts with the site’s exact values.

4 — Layout & structure (DOM)

Use semantic structure and predictable class names. Example:

<body class="page">
  <header class="top-header">
    <div class="header-card">
      <img src="/assets/img/theindiacore.png" alt="IndiaCore logo" class="logo" />
      <h1 class="site-title">TheIndiaCore</h1>
    </div>
  </header>

  <main class="chat-wrapper">
    <section class="chat-card">
      <div class="messages" id="messages" aria-live="polite"></div>   <!-- scrollable -->
      <div class="composer" id="composer">
        <textarea id="input" placeholder="Type your message..." rows="1" aria-label="Message input"></textarea>
        <button id="sendBtn" aria-label="Send" disabled>
          <span class="material-icons">send</span>
        </button>
      </div>
    </section>
  </main>
</body>


Important layout rules

Header centered; header card has rounded corners, slight shadow, greyish border.

Header width on desktop: ~80% of viewport with a hard max width (e.g., max-width: 1100px). On mobile header is full width with small side padding.

Chat card & composer use same width as each other, typically 60–70% on desktop, full width on mobile. They are horizontally centered.

The page body (<body>/main) has no overflow; only .messages region scrolls.

When viewport height increases, .messages stretches to occupy extra vertical space while header and composer remain anchored. Use flex layout.

5 — CSS layout behavior & responsiveness

Key CSS skeleton (conceptual):

Page: min-height: 100vh; display:flex; flex-direction: column; align-items: center;

Chat-wrapper and chat-card: display:flex; flex-direction: column; flex: 1; width: var(--content-width-pc); max-width: var(--max-width-pc);

Header-card: margin-top: 24px; border-radius: var(--radius); padding: 12px 20px; display:flex; gap: 12px; align-items:center; justify-content:center; border:1px solid var(--muted); background: var(--card-bg);

Messages: flex: 1 1 auto; overflow-y: auto; padding: 20px; display:flex; flex-direction: column; gap:12px;

Composer: position: sticky; bottom: 18px; display:flex; gap: 8px; align-items: center; padding: 10px; (or keep fixed at bottom)

Box-sizing: *{box-sizing: border-box;} — ensure margins/paddings never overflow.

Custom scrollbar

Style scrollbar on .messages using CSS for WebKit and fallback for Firefox with scrollbar-width.

Keep trackpad users in mind (thin but visible trackpad style).

6 — Accessibility & UX rules

Use aria-live="polite" on .messages (or aria-atomic where appropriate).

Ensure sufficient color contrast between text and backgrounds.

Keyboard: Enter sends message (Shift+Enter -> newline). sendBtn must be reachable by keyboard.

Provide alt text on logo.

Make area-resize available (textarea auto-resize up to a max height; after that, the .messages scrolls).

7 — Animations & interactions

Typing indicator: When bot is “thinking”, show a right-aligned bubble containing:

company logo image (small) at the left of the bubble, and

three dots that jump in a wave pattern (CSS keyframes).

Bot reply animation: Bot message appears as a bubble where text is revealed word-by-word (not letter-by-letter). Provide configuration for wordDelayMs (e.g., 80–120ms per word) and a small punctuation pause.

Send button behavior:

Initially enabled only when input has non-whitespace characters.

When user presses SEND:

disable send button and input until the bot reply completes (prevent multiple sends).

show typing indicator (with logo + dots).

after simulated delay, animate bot reply word-by-word; on completion, hide typing indicator and enable send button.

Error bubble: special style for errors; appears like bot bubble but with --error-bg and error icon.

8 — JavaScript API / function specification

Provide a structured set of functions the implementation must define. These should be clean, testable, documented.

/** Initializes chat UI and event listeners. Call once on DOM ready. */
function initChat(options = {}) // returns ChatController

/* ChatController methods:
   - sendUserMessage(text) -> appends user bubble and triggers simulated bot reply
   - simulateBotReply(text, options) -> used by tests/dummy responses
   - createUserBubble(text, timestamp?)
   - createBotBubble(text, {type: 'normal'|'error'|'system'})
   - createTypingIndicator() / removeTypingIndicator()
   - animateBotReplyWordByWord(element, text, wordDelayMs)
   - enableSend(), disableSend()
   - renderMarkdown(text) -> returns HTML (uses marked/markdown-it)
*/


Detailed function signatures & behavior

initChat({messagesContainerId='messages', inputId='input', sendBtnId='sendBtn', logoSrc='/assets/img/theindiacore.png', wordDelay: 80})

Attaches input listeners and keyboard handling (Enter vs Shift+Enter).

Auto-resizes textarea up to a maxRows then sets overflow-y for the textarea.

createUserBubble(text: string): HTMLElement

Creates a right-aligned bubble with aria-label="You: <first 10 words>"

Applies class bubble bubble-user.

Renders markdown inline (sanitized).

createBotBubble(text: string, opts = {type: 'normal'}): HTMLElement

Creates left-aligned bubble with company logo thumbnail to the left.

type: 'error' uses error styling and role="status".

createTypingIndicator() => HTMLElement

Returns a bubble element containing the company logo and the animated three-dot wave.

Adds class typing-indicator.

animateBotReplyWordByWord(containerEl, text, {wordDelay=80, punctuationPause=250})

Splits text on whitespace preserving punctuation.

Appends words one by one into the bot bubble DOM (innerHTML via renderer to support Markdown).

Respects HTML-safe encoding; use markdown renderer to produce HTML fragments for each appended word when needed.

disableSend() / enableSend()

toggles disabled attribute and aria-disabled for sendBtn, sets pointer-events.

also manage aria-busy on the .messages container.

simulateBotReply(userText)

Sample logic for dummy testing:

Show typing indicator

after 600–1400ms, call animateBotReplyWordByWord(...) using pre-defined dummy replies mapping or simple echo.

On completion remove typing indicator and enable send.

renderMarkdown(text) — wrapper around markdown lib, with sanitization (DOMPurify or built-in safe renderer). Must prevent XSS.

9 — Dummy messages & test flows

Add a set of dummy messages and mapping for testing. Example mapping (return any of these randomly or based on keywords):

User: hello → Bot: Hi! I’m the IndiaCore assistant. How can I help you today?

User: show features → Bot: I can: \n\n- Answer queries\n- Render **Markdown**\n- Simulate typing and reply word-by-word.\n\n_Ask anything!_

User: error test → Bot (error): Sorry — something went wrong while fetching your request. Please try again.

User: markdown test → Bot:

Here is a list:
- Item 1
- **Bold item**
- `inline code`


(rendered as Markdown)

Test flow:

Type "hello" → Send → user bubble appended → send disabled → typing indicator displayed → simulated delay → bot bubble animated word-by-word → send enabled.

Type "error test" → On reply type 'error' bubble style.

10 — Message formatting & markdown

Use marked.js or markdown-it (client-side CDN) to render markdown. Example: marked.parse(text).

Sanitize rendered HTML with DOMPurify (CDN) before insertion.

Keep a small maxMessageLength (client-side guard) for performance.

Support code blocks, lists, bold, italic, inline code, links (open in new tab).

11 — Scroll behavior

After appending user message or bot word chunk, auto-scroll .messages to bottom smoothly.

If user has manually scrolled up (detect by checking scroll position threshold), do not forcibly scroll; instead show a “new messages” floating hint that when clicked scrolls to bottom.

Use scrollIntoView({behavior: 'smooth', block: 'end'}) for the last message node.

12 — CSS details (speech-bubble shapes)

Use border-radius with slight tail for each bubble (CSS pseudo-element ::after to create pointer).

User bubble: aligned right, greenish background --bubble-user, dark text.

Bot bubble: aligned left, white background with subtle shadow.

Error bubble: pale red background, left aligned with error icon.

13 — Performance & security

No remote code execution. All libs loaded via trusted CDNs (prefer integrity checks).

Sanitize markdown HTML to prevent XSS.

Debounce input resizing and typing detection.

Limit the number of messages in DOM to e.g., 200 (prune oldest to keep memory low).

14 — Testing checklist

 Header centered with logo+title side-by-side, rounded card.

 Chat card and composer widths match spec on desktop and mobile.

 .messages region stretches with increased viewport height; header & composer remain fixed.

 Custom scrollbar appears and is styled (WebKit + Firefox).

 Send button disabled while awaiting bot reply.

 Typing indicator shows logo + jumping three-dot wave.

 Bot reply animates word-by-word, supports punctuation pause.

 Markdown rendering works for lists, bold, code blocks.

 Keyboard: Enter send, Shift+Enter newline.

 Accessibility: aria-live, labels, color contrast.

 Error bubble appears when tripwire "error test" message used.

15 — Example dummy data (copy/paste)
const DUMMY_REPLIES = {
  'hello': "Hi! I'm the IndiaCore assistant. How can I help you today?",
  'show features': "I can:\n\n- Answer queries\n- Render **Markdown**\n- Simulate typing and reply word-by-word.\n\n_Ask anything!_",
  'error test': { type: 'error', text: "Sorry — something went wrong while fetching your request. Please try again." },
  'markdown test': "Here is a list:\n\n- Item 1\n- **Bold item**\n- `inline code`\n\n```js\nconsole.log('code block')\n```"
};

16 — Deliverables & file structure suggestion
/chatbot/
  index.html      <-- single-page
  css/
    style.css
  js/
    chat.js
    markdown-lib.js (CDN recommended)
  assets/
    img/theindiacore.png
  README.md       <-- install/run instructions (open index.html in browser)

17 — Nice-to-have / advanced

Save conversation to localStorage and restore on reload.

Theme toggle (light/dark) that preserves accent.

Quick-reply chips under composer for canned prompts.

Tiny Lottie animation in typing indicator (if you want heavier visuals).

Integrate Web Speech API for optional speech-to-text or TTS (client-side only).

18 — Short ready-to-use instructions for the implementer

Create HTML skeleton with header card, chat card, messages container and composer.

Add CSS variables and responsive breakpoints (@media (max-width: 768px)) to make header and chat full width on mobile.

Implement JS initChat() that wires up input, send button, Enter key, and produces dummy replies from DUMMY_REPLIES.

Use marked.js + DOMPurify to render Markdown safely.

Implement createTypingIndicator(), animateBotReplyWordByWord(), createUserBubble(), createBotBubble(), createErrorBubble() per API above.

Style scrollbars and bubbles, test accessibility and keyboard flows.

images are at assets/img/theindiacore.ico, assets/img/theindiacore.png