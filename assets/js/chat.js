/* ===================================
   TheIndiaCore Chatbot
   ChatController and Core Functionality
   =================================== */

/**
 * DUMMY_REPLIES - Simulated bot responses for testing
 * Implements Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */
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

/**
 * ComposerManager - Handles textarea auto-resize and input management
 * Implements Requirements: 11.1, 11.2, 11.3
 */
class ComposerManager {
  constructor(textarea, sendBtn, onSend) {
    this.textarea = textarea;
    this.sendBtn = sendBtn;
    this.onSend = onSend;
    this.maxRows = 5;
    this.lineHeight = 24; // pixels
    
    this.attachListeners();
  }
  
  /**
   * Attach event listeners for auto-resize and input handling
   */
  attachListeners() {
    // Auto-resize on input
    this.textarea.addEventListener('input', () => {
      this.autoResize();
    });
  }
  
  /**
   * Auto-resize textarea based on content
   * Implements Requirements: 11.1, 11.2, 11.3
   */
  autoResize() {
    // Reset height to auto to get accurate scrollHeight
    this.textarea.style.height = 'auto';
    
    // Calculate the number of rows based on scrollHeight
    const scrollHeight = this.textarea.scrollHeight;
    const maxHeight = this.maxRows * this.lineHeight;
    
    // Set height based on content, but limit to max height
    if (scrollHeight <= maxHeight) {
      this.textarea.style.height = scrollHeight + 'px';
      this.textarea.style.overflowY = 'hidden';
    } else {
      this.textarea.style.height = maxHeight + 'px';
      this.textarea.style.overflowY = 'auto';
    }
  }
  
  /**
   * Reset textarea to initial state
   * Implements Requirement: 11.4
   */
  reset() {
    this.textarea.value = '';
    this.textarea.style.height = 'auto';
    this.textarea.style.overflowY = 'hidden';
  }
  
  /**
   * Enable textarea input
   */
  enable() {
    this.textarea.disabled = false;
  }
  
  /**
   * Disable textarea input
   */
  disable() {
    this.textarea.disabled = true;
  }
  
  /**
   * Get current textarea value
   */
  getValue() {
    return this.textarea.value;
  }
  
  /**
   * Focus the textarea
   */
  focus() {
    this.textarea.focus();
  }
}

/**
 * MarkdownRenderer - Handles markdown parsing and sanitization
 * Implements Requirements: 4.4, 6.1, 6.2, 6.3
 */
class MarkdownRenderer {
  constructor() {
    // Configure marked.js options
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,        // Convert \n to <br>
        gfm: true,          // GitHub Flavored Markdown
        headerIds: false    // Don't add IDs to headers
      });
    }
  }
  
  /**
   * Render markdown text to sanitized HTML
   * Implements Requirements: 4.4, 6.1, 6.2, 6.3
   * @param {string} text - The markdown text to render
   * @returns {string} Sanitized HTML string
   */
  render(text) {
    // Check if marked.js is available
    if (typeof marked === 'undefined') {
      console.warn('marked.js not loaded, returning plain text');
      return this.escapeHtml(text);
    }
    
    // Parse markdown to HTML
    const rawHtml = marked.parse(text);
    
    // Check if DOMPurify is available
    if (typeof DOMPurify === 'undefined') {
      console.warn('DOMPurify not loaded, returning escaped text');
      return this.escapeHtml(text);
    }
    
    // Sanitize HTML with DOMPurify using allowlist
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
      // Add target="_blank" to all links (Requirement 6.3)
      ADD_ATTR: ['target'],
      // Hook to add rel="noopener noreferrer" to external links
      HOOKS: {
        afterSanitizeAttributes: (node) => {
          // Add target="_blank" and rel="noopener noreferrer" to all links
          if (node.tagName === 'A') {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
          }
        }
      }
    });
    
    return sanitizedHtml;
  }
  
  /**
   * Escape HTML entities for fallback when libraries aren't available
   * @param {string} text - The text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * ChatController - Main application controller
 * Implements Requirements: 3.1, 3.2
 */
class ChatController {
  constructor(options = {}) {
    // Store DOM element references
    this.messagesContainer = document.getElementById(options.messagesContainerId || 'messages');
    this.input = document.getElementById(options.inputId || 'input');
    this.sendBtn = document.getElementById(options.sendBtnId || 'sendBtn');
    
    // Configuration options
    this.logoSrc = options.logoSrc || 'assets/img/theindiacore.png';
    this.wordDelay = options.wordDelay || 100;
    this.punctuationPause = options.punctuationPause || 250;
    this.maxMessages = options.maxMessages || 200;
    
    // State variables
    this.messageCount = 0;
    this.isProcessing = false;
    this.typingIndicator = null;
    this.isFirstMessage = true;
    
    // Initialize markdown renderer
    this.markdownRenderer = new MarkdownRenderer();
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the chat controller
   * Set up event listeners and composer manager
   * Implements Requirements: 3.1, 3.2
   */
  init() {
    // Initialize ComposerManager for textarea auto-resize
    this.composerManager = new ComposerManager(
      this.input,
      this.sendBtn,
      () => this.sendUserMessage()
    );
    
    // Attach keyboard event handling (Requirement 3.5, 3.6)
    this.attachKeyboardListeners();
    
    // Attach send button state management (Requirement 3.3, 3.4)
    this.attachSendButtonStateListeners();
    
    // Attach send button click listener
    this.sendBtn.addEventListener('click', () => {
      this.sendUserMessage();
    });
    
    // Initialize slideshow
    this.initSlideshow();
  }
  
  /**
   * Initialize welcome slideshow
   */
  initSlideshow() {
    const slideshow = document.getElementById('welcomeSlideshow');
    if (!slideshow) return;
    
    const slides = slideshow.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Auto-advance slides every 3 seconds
    this.slideshowInterval = setInterval(() => {
      slides[currentSlide].classList.remove('active');
      
      currentSlide = (currentSlide + 1) % slides.length;
      
      slides[currentSlide].classList.add('active');
    }, 3000);
  }
  
  /**
   * Hide welcome slideshow
   */
  hideSlideshow() {
    const slideshow = document.getElementById('welcomeSlideshow');
    if (slideshow) {
      slideshow.classList.add('hidden');
      if (this.slideshowInterval) {
        clearInterval(this.slideshowInterval);
      }
    }
  }
  
  /**
   * Attach keyboard event listeners for Enter and Shift+Enter
   * Implements Requirements: 3.5, 3.6
   */
  attachKeyboardListeners() {
    this.input.addEventListener('keydown', (e) => {
      // Check if Enter key is pressed
      if (e.key === 'Enter') {
        // If Shift is not pressed, send message
        if (!e.shiftKey) {
          e.preventDefault(); // Prevent default newline behavior
          this.sendUserMessage();
        }
        // If Shift+Enter, allow default newline behavior (do nothing)
      }
    });
  }
  
  /**
   * Attach input event listener for send button state management
   * Implements Requirements: 3.3, 3.4
   */
  attachSendButtonStateListeners() {
    this.input.addEventListener('input', () => {
      const value = this.input.value.trim();
      
      // Enable send button if textarea has non-whitespace content
      if (value.length > 0) {
        this.enableSend();
      } else {
        // Disable send button if textarea is empty or whitespace-only
        this.disableSend();
      }
    });
  }
  
  /**
   * Enable send button
   * Implements Requirement: 3.4
   */
  enableSend() {
    this.sendBtn.disabled = false;
  }
  
  /**
   * Disable send button
   * Implements Requirement: 3.4
   */
  disableSend() {
    this.sendBtn.disabled = true;
  }
  
  /**
   * Send user message
   * Implements Requirements: 4.1, 4.5, 7.1, 7.2, 11.4, 11.5
   */
  sendUserMessage() {
    // Trim and validate input text (reject if empty or whitespace-only)
    const text = this.composerManager.getValue().trim();
    
    if (!text || this.isProcessing) {
      return;
    }
    
    // Check message length limit (2000 characters)
    if (text.length > 2000) {
      alert('Message is too long. Please limit to 2000 characters.');
      return;
    }
    
    // Hide slideshow on first message
    if (this.isFirstMessage) {
      this.hideSlideshow();
      this.isFirstMessage = false;
    }
    
    // Create user bubble and append to messages container
    const userBubble = this.createUserBubble(text);
    this.messagesContainer.appendChild(userBubble);
    this.messageCount++;
    
    // Scroll to bottom smoothly
    this.scrollToBottom();
    
    // Clear and reset textarea
    this.composerManager.reset();
    
    // Disable send button and textarea
    this.disableSend();
    this.composerManager.disable();
    
    // Set isProcessing flag to true
    this.isProcessing = true;
    
    // Call simulateBotReply() with user text
    this.simulateBotReply(text);
  }
  
  /**
   * Simulate bot reply with typing indicator and word-by-word animation
   * Implements Requirements: 5.1, 5.4, 5.5, 8.5, 12.1, 12.2, 12.3, 12.4, 12.5
   * @param {string} userText - The user's message text
   */
  simulateBotReply(userText) {
    // Look up response from DUMMY_REPLIES based on user text (case-insensitive)
    const lowerUserText = userText.toLowerCase();
    let response = DUMMY_REPLIES[lowerUserText];
    
    // Use '_default' response if no match found, replacing {input} placeholder
    if (!response) {
      response = {
        type: DUMMY_REPLIES['_default'].type,
        text: DUMMY_REPLIES['_default'].text.replace('{input}', userText)
      };
    }
    
    // Create and append typing indicator
    const typingIndicator = this.createTypingIndicator();
    this.messagesContainer.appendChild(typingIndicator);
    
    // Scroll to bottom
    this.scrollToBottom();
    
    // Set random delay between 600-1400ms
    const delay = 600 + Math.random() * 800;
    
    setTimeout(() => {
      // After delay, remove typing indicator
      this.removeTypingIndicator();
      
      // Check response type (bot vs error)
      if (response.type === 'bot') {
        // Create bot bubble
        const botBubble = this.createBotBubble(response.text);
        this.messagesContainer.appendChild(botBubble);
        this.messageCount++;
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Call animateBotReplyWordByWord()
        this.animateBotReplyWordByWord(botBubble, response.text);
      } else if (response.type === 'error') {
        // Create error bubble
        const errorBubble = this.createErrorBubble(response.text);
        this.messagesContainer.appendChild(errorBubble);
        this.messageCount++;
        
        // Display immediately and re-enable composer
        this.scrollToBottom();
        this.enableSend();
        this.composerManager.enable();
        this.composerManager.focus();
        this.isProcessing = false;
      }
      
      // Prune old messages if needed
      this.pruneOldMessages();
    }, delay);
  }
  
  /**
   * Animate bot reply word-by-word
   * Implements Requirements: 5.5, 7.3, 7.4, 7.5
   * @param {HTMLElement} bubble - The bot bubble element
   * @param {string} text - The message text to animate
   */
  animateBotReplyWordByWord(bubble, text) {
    // Render full markdown to get complete HTML
    const fullHtml = this.markdownRenderer.render(text);
    
    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullHtml;
    
    // Extract text content while preserving structure
    // We'll split by words but need to handle HTML tags
    const bubbleContent = bubble.querySelector('.bubble-content');
    
    // Split text into words preserving whitespace
    const words = text.split(/(\s+)/);
    
    let currentIndex = 0;
    let currentText = '';
    
    const animateNextWord = () => {
      if (currentIndex >= words.length) {
        // Animation complete
        // Render the full markdown HTML
        bubbleContent.innerHTML = fullHtml;
        
        // Enable send button and textarea, focus textarea
        this.enableSend();
        this.composerManager.enable();
        this.composerManager.focus();
        
        // Set isProcessing flag to false
        this.isProcessing = false;
        
        return;
      }
      
      // Get next word
      const word = words[currentIndex];
      currentText += word;
      currentIndex++;
      
      // Render current text as markdown
      bubbleContent.innerHTML = this.markdownRenderer.render(currentText);
      
      // Scroll to bottom
      this.scrollToBottom();
      
      // Check if word ends with punctuation for pause
      const trimmedWord = word.trim();
      const hasPunctuation = /[.!?,;]$/.test(trimmedWord);
      
      // Apply wordDelay (100ms) between words
      // Add punctuationPause (250ms) after punctuation marks
      const delay = hasPunctuation ? this.punctuationPause : this.wordDelay;
      
      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        setTimeout(animateNextWord, delay);
      });
    };
    
    // Start animation
    animateNextWord();
  }
  
  /**
   * Scroll messages container to bottom
   * Implements Requirement: 4.5
   * @param {boolean} smooth - Whether to use smooth scrolling
   */
  scrollToBottom(smooth = true) {
    // Get last message element in messages container
    const lastMessage = this.messagesContainer.lastElementChild;
    
    // Handle case when container is empty
    if (!lastMessage) {
      return;
    }
    
    // Call scrollIntoView with smooth behavior
    lastMessage.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  }
  
  /**
   * Prune old messages to maintain performance
   * Implements Requirement: 9.5
   */
  pruneOldMessages() {
    // Check if messageCount exceeds maxMessages (200)
    while (this.messageCount > this.maxMessages) {
      // Remove oldest message element from DOM
      const firstMessage = this.messagesContainer.firstElementChild;
      if (firstMessage) {
        this.messagesContainer.removeChild(firstMessage);
        this.messageCount--;
      } else {
        break;
      }
    }
  }
  
  /**
   * Create user message bubble
   * Implements Requirements: 4.1, 4.2, 4.3, 4.4
   * @param {string} text - The message text
   * @returns {HTMLElement} The user bubble element
   */
  createUserBubble(text) {
    // Create bubble container
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-user';
    bubble.setAttribute('role', 'article');
    
    // Create aria-label with first 10 words
    const words = text.split(/\s+/).slice(0, 10).join(' ');
    bubble.setAttribute('aria-label', `You: ${words}`);
    
    // Create bubble content div and render markdown
    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'bubble-content';
    // Render markdown with sanitization (Requirement 4.4)
    bubbleContent.innerHTML = this.markdownRenderer.render(text);
    
    // Create timestamp span with current time (HH:MM format)
    const timestamp = document.createElement('span');
    timestamp.className = 'bubble-timestamp';
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timestamp.textContent = `${hours}:${minutes}`;
    
    // Append elements to bubble
    bubble.appendChild(bubbleContent);
    bubble.appendChild(timestamp);
    
    return bubble;
  }
  
  /**
   * Create bot message bubble
   * Implements Requirements: 6.4, 6.5
   * @param {string} text - The message text
   * @returns {HTMLElement} The bot bubble element
   */
  createBotBubble(text) {
    // Create bubble container
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-bot';
    bubble.setAttribute('role', 'article');
    
    // Create aria-label with first 10 words
    const words = text.split(/\s+/).slice(0, 10).join(' ');
    bubble.setAttribute('aria-label', `Bot: ${words}`);
    
    // Add logo image
    const logo = document.createElement('img');
    logo.src = this.logoSrc;
    logo.alt = 'IndiaCore';
    logo.className = 'bubble-avatar';
    
    // Create bubble content div (empty, to be filled by animation)
    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'bubble-content';
    
    // Create timestamp span
    const timestamp = document.createElement('span');
    timestamp.className = 'bubble-timestamp';
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timestamp.textContent = `${hours}:${minutes}`;
    
    // Append elements to bubble
    bubble.appendChild(logo);
    bubble.appendChild(bubbleContent);
    bubble.appendChild(timestamp);
    
    return bubble;
  }
  
  /**
   * Create error message bubble
   * Implements Requirements: 8.1, 8.2, 8.3, 8.4
   * @param {string} text - The error message text
   * @returns {HTMLElement} The error bubble element
   */
  createErrorBubble(text) {
    // Create bubble container
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-error';
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-label', `Error: ${text}`);
    
    // Add logo image
    const logo = document.createElement('img');
    logo.src = this.logoSrc;
    logo.alt = 'IndiaCore';
    logo.className = 'bubble-avatar';
    
    // Add error icon
    const errorIcon = document.createElement('span');
    errorIcon.className = 'material-icons error-icon';
    errorIcon.textContent = 'error_outline';
    
    // Create bubble content div with error text
    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'bubble-content';
    bubbleContent.textContent = text;
    
    // Append elements to bubble
    bubble.appendChild(logo);
    bubble.appendChild(errorIcon);
    bubble.appendChild(bubbleContent);
    
    return bubble;
  }
  
  /**
   * Create typing indicator
   * Implements Requirements: 5.1, 5.2, 5.3
   * @returns {HTMLElement} The typing indicator element
   */
  createTypingIndicator() {
    // Create bubble container
    const bubble = document.createElement('div');
    bubble.className = 'bubble typing-indicator';
    bubble.setAttribute('aria-label', 'Bot is typing');
    bubble.setAttribute('aria-live', 'polite');
    
    // Add logo image
    const logo = document.createElement('img');
    logo.src = this.logoSrc;
    logo.alt = 'IndiaCore';
    logo.className = 'bubble-avatar';
    
    // Create typing dots container
    const typingDots = document.createElement('div');
    typingDots.className = 'typing-dots';
    
    // Create three dot elements
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      typingDots.appendChild(dot);
    }
    
    // Append elements to bubble
    bubble.appendChild(logo);
    bubble.appendChild(typingDots);
    
    // Store reference
    this.typingIndicator = bubble;
    
    return bubble;
  }
  
  /**
   * Remove typing indicator from DOM
   * Implements Requirement: 5.4
   */
  removeTypingIndicator() {
    // Check if typing indicator exists in DOM
    if (this.typingIndicator && this.typingIndicator.parentNode) {
      // Remove typing indicator element from messages container
      this.typingIndicator.parentNode.removeChild(this.typingIndicator);
    }
    
    // Clear reference
    this.typingIndicator = null;
  }
}

// Initialize ChatController on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.chatController = new ChatController({
    messagesContainerId: 'messages',
    inputId: 'input',
    sendBtnId: 'sendBtn',
    logoSrc: 'assets/img/theindiacore.png',
    wordDelay: 100,
    punctuationPause: 250,
    maxMessages: 200
  });
});
