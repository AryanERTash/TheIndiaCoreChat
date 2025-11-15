# Requirements Document

## Introduction

This document specifies the requirements for a single-page, frontend-only chatbot UI for theIndiaCore.in. The chatbot provides a conversational interface with simulated responses, featuring a clean design that matches the site's white and lime-green aesthetic. The implementation is entirely client-side with no backend dependencies, using vanilla JavaScript for animations and interactions.

## Glossary

- **ChatUI**: The complete chatbot user interface system including header, message display, and input composer
- **Message Bubble**: A visual container displaying a single message from either the user or bot
- **Typing Indicator**: An animated visual element showing three jumping dots with the company logo, indicating the bot is processing
- **Composer**: The input area at the bottom of the chat interface containing the textarea and send button
- **Message Container**: The scrollable region displaying the conversation history
- **Word-by-Word Animation**: A text reveal animation that displays bot responses one word at a time

## Requirements

### Requirement 1

**User Story:** As a visitor to theIndiaCore.in, I want to see a visually appealing chatbot interface that matches the site's branding, so that I have a consistent and professional experience.

#### Acceptance Criteria

1. THE ChatUI SHALL display a centered header card containing the company logo and "TheIndiaCore" title positioned side-by-side
2. THE ChatUI SHALL apply a white background color with lime-green accent colors matching the site's brand palette
3. THE ChatUI SHALL use Material Sans or Roboto font family for all text elements
4. THE ChatUI SHALL display rounded corners with 14px border radius on all card elements
5. THE ChatUI SHALL apply subtle shadows (0 6px 18px rgba(12,16,20,0.06)) to card elements

### Requirement 2

**User Story:** As a user on different devices, I want the chatbot interface to adapt to my screen size, so that I can use it comfortably on desktop, tablet, or mobile.

#### Acceptance Criteria

1. WHEN the viewport width exceeds 768px, THE ChatUI SHALL set the header card width to 80% of viewport with a maximum width of 1100px
2. WHEN the viewport width exceeds 768px, THE ChatUI SHALL set the message container and composer width to 65% of viewport with a maximum width of 1100px
3. WHEN the viewport width is 768px or less, THE ChatUI SHALL set the header card, message container, and composer to full width with 16px horizontal padding
4. WHEN the viewport height increases, THE Message Container SHALL expand vertically to fill available space while keeping header and composer positions fixed
5. THE ChatUI SHALL center all content horizontally on the page

### Requirement 3

**User Story:** As a user, I want to send messages to the chatbot using a text input and send button, so that I can interact with the assistant.

#### Acceptance Criteria

1. THE Composer SHALL display a textarea input field with placeholder text "Type your message..."
2. THE Composer SHALL display a send button with a Material Icons "send" icon
3. WHEN the textarea contains only whitespace characters, THE Composer SHALL disable the send button
4. WHEN the textarea contains non-whitespace characters, THE Composer SHALL enable the send button
5. WHEN the user presses Enter key without Shift, THE Composer SHALL submit the message and prevent default newline behavior
6. WHEN the user presses Shift+Enter keys, THE Composer SHALL insert a newline character in the textarea

### Requirement 4

**User Story:** As a user, I want to see my sent messages displayed in the chat, so that I can track the conversation history.

#### Acceptance Criteria

1. WHEN the user submits a message, THE ChatUI SHALL create a user message bubble containing the submitted text
2. THE ChatUI SHALL align user message bubbles to the right side of the Message Container
3. THE ChatUI SHALL apply a light green background color (--bubble-user) to user message bubbles
4. THE ChatUI SHALL render Markdown formatting within user message bubbles
5. WHEN a user message bubble is created, THE Message Container SHALL scroll smoothly to display the newest message at the bottom

### Requirement 5

**User Story:** As a user, I want to see the bot's responses with a typing animation, so that the interaction feels natural and engaging.

#### Acceptance Criteria

1. WHEN the user submits a message, THE ChatUI SHALL display the Typing Indicator for 600 to 1400 milliseconds
2. THE Typing Indicator SHALL display the company logo image on the left side
3. THE Typing Indicator SHALL display three dots that animate in a jumping wave pattern
4. WHEN the typing delay completes, THE ChatUI SHALL remove the Typing Indicator
5. WHEN the typing delay completes, THE ChatUI SHALL create a bot message bubble and animate the response text word-by-word with 80-120ms delay between words

### Requirement 6

**User Story:** As a user, I want bot responses to support rich text formatting, so that I can read structured information clearly.

#### Acceptance Criteria

1. THE ChatUI SHALL render Markdown syntax in bot message bubbles including bold, italic, inline code, code blocks, and lists
2. THE ChatUI SHALL sanitize all rendered HTML to prevent XSS attacks
3. THE ChatUI SHALL render hyperlinks in bot messages with target="_blank" attribute
4. THE ChatUI SHALL align bot message bubbles to the left side of the Message Container
5. THE ChatUI SHALL display the company logo thumbnail on the left side of each bot message bubble

### Requirement 7

**User Story:** As a user, I want the interface to prevent multiple simultaneous message submissions, so that the conversation flow remains orderly.

#### Acceptance Criteria

1. WHEN a user message is submitted, THE Composer SHALL disable the send button until the bot response animation completes
2. WHEN a user message is submitted, THE Composer SHALL disable the textarea input until the bot response animation completes
3. WHEN the bot response animation completes, THE Composer SHALL enable the send button
4. WHEN the bot response animation completes, THE Composer SHALL enable the textarea input
5. WHEN the bot response animation completes, THE Composer SHALL focus the textarea input

### Requirement 8

**User Story:** As a user, I want to see error messages when something goes wrong, so that I understand the system status.

#### Acceptance Criteria

1. WHEN an error response is triggered, THE ChatUI SHALL create an error message bubble with a pale red background color (--error-bg)
2. THE ChatUI SHALL align error message bubbles to the left side like bot messages
3. THE ChatUI SHALL display an error icon within error message bubbles
4. THE ChatUI SHALL apply role="status" attribute to error message bubbles for accessibility
5. WHEN the user sends "error test" message, THE ChatUI SHALL simulate an error response

### Requirement 9

**User Story:** As a user, I want the message history to be scrollable with a custom-styled scrollbar, so that I can review past messages in an aesthetically pleasing interface.

#### Acceptance Criteria

1. THE Message Container SHALL enable vertical scrolling when content exceeds container height
2. THE Message Container SHALL apply custom scrollbar styling for WebKit browsers with thin width and accent color thumb
3. THE Message Container SHALL apply scrollbar-width: thin for Firefox browsers
4. THE Message Container SHALL prevent horizontal scrolling
5. THE Message Container SHALL display a maximum of 200 messages and remove oldest messages when limit is exceeded

### Requirement 10

**User Story:** As a user with accessibility needs, I want the chatbot interface to support keyboard navigation and screen readers, so that I can use it effectively.

#### Acceptance Criteria

1. THE Message Container SHALL include aria-live="polite" attribute for screen reader announcements
2. THE Composer send button SHALL include aria-label="Send" attribute
3. THE Composer textarea SHALL include aria-label="Message input" attribute
4. THE ChatUI SHALL maintain color contrast ratio of at least 4.5:1 between text and background colors
5. THE Composer send button SHALL be reachable and operable via keyboard navigation

### Requirement 11

**User Story:** As a user, I want the textarea to automatically resize as I type, so that I can see my full message without manual scrolling.

#### Acceptance Criteria

1. WHEN the user types text in the textarea, THE Composer SHALL automatically increase textarea height to fit content
2. THE Composer SHALL limit textarea height to a maximum of 5 rows
3. WHEN textarea content exceeds 5 rows, THE Composer SHALL enable vertical scrolling within the textarea
4. WHEN the user submits a message, THE Composer SHALL reset textarea height to 1 row
5. THE Composer SHALL clear textarea content after message submission

### Requirement 12

**User Story:** As a user testing the chatbot, I want to receive predefined responses to specific keywords, so that I can explore the chatbot's capabilities.

#### Acceptance Criteria

1. WHEN the user sends "hello", THE ChatUI SHALL respond with "Hi! I'm the IndiaCore assistant. How can I help you today?"
2. WHEN the user sends "show features", THE ChatUI SHALL respond with a Markdown-formatted list of capabilities
3. WHEN the user sends "error test", THE ChatUI SHALL display an error message bubble
4. WHEN the user sends "markdown test", THE ChatUI SHALL respond with a message demonstrating Markdown rendering including lists, bold text, inline code, and code blocks
5. WHEN the user sends an unrecognized message, THE ChatUI SHALL respond with a default acknowledgment message
