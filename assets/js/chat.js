/* ===================================
   TheIndiaCore Chatbot
   ChatController and Core Functionality
   =================================== */

/**
 * THE INDIA CORE - Configuration
 */
// Use relative URL since frontend and backend are on same server
const GEMINI_API_URL = '/chat';


// Topic names (always displayed in English)
const TOPICS = {
	'1': 'Interesting Facts',
	'2': 'Festivals',
	'3': 'Art Forms',
	'4': 'Dance',
	'5': 'Cuisine',
	'6': 'Ethnic Wear',
	'7': 'Famous For',
	'8': 'Languages'
};

// Featured states (always displayed in English)
const FEATURED_STATES = ['Maharashtra', 'Rajasthan', 'Himachal Pradesh', 'Kerala', 'Odisha'];

// All Indian states and union territories (always displayed in English)
const ALL_STATES = [
	'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
	'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
	'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
	'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
	'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
	'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
	'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
	'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

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
		this.wordDelay = options.wordDelay || 5;
		this.punctuationPause = options.punctuationPause || 250;
		this.maxMessages = options.maxMessages || 200;
		this.maxHistoryMessages = options.maxHistoryMessages || 50;

		// State variables
		this.messageCount = 0;
		this.isProcessing = false;
		this.typingIndicator = null;
		this.isFirstMessage = true;
		this.selectedLanguage = 'en';
		this.conversationHistory = [];
		this.currentState = null;
		this.menuMode = false;

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

		// Attach language selector listener
		this.attachLanguageSelector();

		// Attach Say Hi button listener
		this.attachSayHiButton();

		// Initialize slideshow
		this.initSlideshow();
	}

	/**
	 * Attach Say Hi button event listener
	 */
	attachSayHiButton() {
		const sayHiBtn = document.getElementById('sayHiBtn');
		if (sayHiBtn) {
			sayHiBtn.addEventListener('click', () => {
				this.showMainMenuWithGemini();
			});
		}
	}

	/**
	 * Attach language selector event listener
	 */
	attachLanguageSelector() {
		const languageSelect = document.getElementById('languageSelect');
		if (languageSelect) {
			languageSelect.addEventListener('change', (e) => {
				this.selectedLanguage = e.target.value;
				console.log('Language changed to:', this.selectedLanguage);
				// You can add additional logic here to handle language change
				// For example, update placeholder text or send language preference to backend
			});
		}
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
	 * Show main menu with Gemini-generated welcome message about India
	 */
	async showMainMenuWithGemini() {
		this.menuMode = true;
		this.currentState = null;

		// Hide slideshow if first interaction
		if (this.isFirstMessage) {
			this.hideSlideshow();
			this.isFirstMessage = false;
		}

		// Disable input and Say Hi button while processing
		this.disableSend();
		this.composerManager.disable();
		const sayHiBtn = document.getElementById('sayHiBtn');
		if (sayHiBtn) sayHiBtn.disabled = true;
		this.isProcessing = true;

		// Show typing indicator
		const typingIndicator = this.createTypingIndicator();
		this.messagesContainer.appendChild(typingIndicator);
		this.scrollToBottom();

		// Send simple message - system prompt will handle formatting
		const userMessage = "Say Hi";

		const response = await this.callGeminiAPI(userMessage);

		// Remove typing indicator
		this.removeTypingIndicator();

		if (response.type === 'bot') {
			const botBubble = this.createBotBubble(response.text);
			this.messagesContainer.appendChild(botBubble);
			this.messageCount++;

			// Add to conversation history
			this.conversationHistory.push({
				role: 'assistant',
				content: response.text,
				timestamp: new Date().toISOString()
			});

			// Prune conversation history
			this.pruneConversationHistory();

			// Add state selection buttons (always in English)
			const buttonContainer = this.createButtonContainer({
				featured: FEATURED_STATES,
				dropdown: true
			});
			this.messagesContainer.appendChild(buttonContainer);

			this.scrollToBottom();
			this.animateBotReplyWordByWord(botBubble, response.text, buttonContainer);
		} else {
			// Fallback to error
			const errorBubble = this.createErrorBubble(response.text);
			this.messagesContainer.appendChild(errorBubble);
			this.messageCount++;

			this.scrollToBottom();
			this.enableSend();
			this.composerManager.enable();
			this.composerManager.focus();
			this.isProcessing = false;
		}
	}

	/**
	 * Generate state description using Gemini API
	 */
	async generateStateDescription(stateName) {
		this.currentState = stateName;

		const languageName = this.getSelectedLanguageName();

		// Create prompt for Gemini to generate state description
		const prompt = `Generate a brief description of ${stateName}, India in ${languageName} language.

FORMAT:
- 1 short paragraph (2-3 sentences) introducing ${stateName}
- 4-6 bullet points with key facts (use emojis like 📍 🏔️ 🌊 🎭 🍛)
- End with: "What would you like to know more about? 🔍"

STYLE: Factual, concise, use emojis. Keep total response under 120 words.

Write EVERYTHING in ${languageName} language.`;

		const response = await this.callGeminiAPI(prompt);

		if (response.type === 'bot') {
			return {
				text: response.text,
				buttons: {
					topics: Object.entries(TOPICS).map(([id, name]) => ({ id, name }))
				}
			};
		} else {
			return {
				text: response.text,
				buttons: {}
			};
		}
	}

	/**
	 * Generate topic information using Gemini API
	 */
	async generateTopicResponse(stateName, topicName) {
		const languageName = this.getSelectedLanguageName();

		// Create prompt for Gemini to generate topic-specific information
		const prompt = `Generate information about "${topicName}" of ${stateName}, India in ${languageName} language.

FORMAT:
- 1 short paragraph (2-3 sentences) about ${topicName} in ${stateName}
- 5-7 bullet points with specific facts/examples (use relevant emojis)
- Include cultural significance if applicable

STYLE: Factual, specific, use emojis. Keep total response under 150 words.

Write EVERYTHING in ${languageName} language.`;

		const response = await this.callGeminiAPI(prompt);

		return {
			text: response.text,
			buttons: {}
		};
	}

	/**
	 * Create button element
	 */
	createButton(text, onClick) {
		const button = document.createElement('button');
		button.className = 'text-long-btn';
		button.textContent = text;
		button.onclick = onClick;
		return button;
	}

	/**
	 * Create state dropdown (always in English)
	 */
	createStateDropdown(onChange) {
		const container = document.createElement('div');
		container.className = 'state-dropdown-container';

		const label = document.createElement('label');
		label.textContent = 'Or select from all states:';

		const select = document.createElement('select');

		const defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.textContent = '-- Select a State --';
		select.appendChild(defaultOption);

		ALL_STATES.forEach(state => {
			const option = document.createElement('option');
			option.value = state;
			option.textContent = state;
			select.appendChild(option);
		});

		select.onchange = (e) => {
			if (e.target.value) {
				onChange(e.target.value);
			}
		};

		container.appendChild(label);
		container.appendChild(select);
		return container;
	}

	/**
	 * Get selected language name
	 */
	getSelectedLanguageName() {
		const languageSelect = document.getElementById('languageSelect');
		const selectedOption = languageSelect.options[languageSelect.selectedIndex];
		return selectedOption.textContent.split('(')[0].trim();
	}

	/**
	 * Call Gemini API with language-aware system prompt and conversation history
	 * Implements Requirements: 13.2, 13.3, 14.2, 14.3, 14.4
	 */
	async callGeminiAPI(userMessage) {
		try {
			const languageName = this.getSelectedLanguageName();

			const systemPrompt = `You are The India Core assistant, an expert on Indian culture, geography, and traditions.

CRITICAL RULES:
1. Respond in ${languageName} language
2. Keep responses SHORT: 1 paragraph + bullet points
3. Use emojis to make content engaging
4. Be FACTUAL and SPECIFIC - include names, numbers, examples
5. Use markdown: **bold** for emphasis, bullet points for lists
6. Maximum 150 words per response unless asked for more detail
7. Warm, friendly tone but concise
FORMAT: Brief intro paragraph + 4-7 factual bullet points with emojis
Context: Helping users explore India's 28 states and 8 union territories.`;

			// Prepare POST request body
			const requestBody = {
				message: userMessage,
				system_prompt: systemPrompt,
				history: this.conversationHistory
			};

			// Send POST request
			const response = await fetch(GEMINI_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			const data = await response.json();

			if (data.success && data.response) {
				return {
					type: 'bot',
					text: data.response
				};
			} else {
				return {
					type: 'error',
					text: data.error || 'Sorry, I encountered an error. Please try again.'
				};
			}
		} catch (error) {
			console.error('Gemini API error:', error);
			return {
				type: 'error',
				text: 'Sorry — something went wrong while fetching your request. Please try again.'
			};
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
	sendUserMessage(text = null, isMenuAction = false) {
		// Get text from input if not provided
		if (!text) {
			text = this.composerManager.getValue().trim();
		}

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

		// Create user bubble and append to messages container (only if not menu action)
		if (!isMenuAction) {
			const userBubble = this.createUserBubble(text);
			this.messagesContainer.appendChild(userBubble);
			this.messageCount++;

			// Add to conversation history
			this.conversationHistory.push({
				role: 'user',
				content: text,
				timestamp: new Date().toISOString()
			});
		}

		// Scroll to bottom smoothly
		this.scrollToBottom();

		// Clear and reset textarea
		this.composerManager.reset();

		// Disable send button and textarea
		this.disableSend();
		this.composerManager.disable();

		// Set isProcessing flag to true
		this.isProcessing = true;

		// Process message
		this.processMessage(text);
	}

	/**
	 * Process user message and generate response
	 * @param {string} userText - The user's message text
	 */
	async processMessage(userText) {
		// Show typing indicator
		const typingIndicator = this.createTypingIndicator();
		this.messagesContainer.appendChild(typingIndicator);
		this.scrollToBottom();

		let response = null;
		let buttons = null;

		// Check if user selected a state (from button or typed)
		const selectedState = ALL_STATES.find(state => state.toLowerCase() === userText.toLowerCase());

		if (selectedState) {
			// User selected a state - generate state description
			const menuData = await this.generateStateDescription(selectedState);
			response = { type: 'bot', text: menuData.text };
			buttons = menuData.buttons;
		} else if (this.currentState) {
			// Check if user selected a topic by name
			const topicEntry = Object.entries(TOPICS).find(([id, name]) => name.toLowerCase() === userText.toLowerCase());
			if (topicEntry) {
				const [topicId, topicName] = topicEntry;
				const menuData = await this.generateTopicResponse(this.currentState, topicName);
				response = { type: 'bot', text: menuData.text };
				buttons = menuData.buttons;
			} else {
				// Free-form question about current state - call Gemini API with context
				const languageName = this.getSelectedLanguageName();
				
				response = await this.callGeminiAPI(userText);
			}
		} else {
			// Free-form question - call Gemini API
			response = await this.callGeminiAPI(userText);
		}

		// Remove typing indicator
		this.removeTypingIndicator();

		// Create bot bubble
		if (response.type === 'bot') {
			const botBubble = this.createBotBubble(response.text);
			this.messagesContainer.appendChild(botBubble);
			this.messageCount++;

			// Add to conversation history
			this.conversationHistory.push({
				role: 'assistant',
				content: response.text,
				timestamp: new Date().toISOString()
			});

			// Prune conversation history
			this.pruneConversationHistory();

			// Add buttons if provided (will be shown after animation)
			let buttonContainer = null;
			if (buttons) {
				buttonContainer = this.createButtonContainer(buttons);
				this.messagesContainer.appendChild(buttonContainer);
			}

			this.scrollToBottom();
			this.animateBotReplyWordByWord(botBubble, response.text, buttonContainer);
		} else if (response.type === 'error') {
			const errorBubble = this.createErrorBubble(response.text);
			this.messagesContainer.appendChild(errorBubble);
			this.messageCount++;

			this.scrollToBottom();
			this.enableSend();
			this.composerManager.enable();
			this.composerManager.focus();
			this.isProcessing = false;
		}

		// Prune old messages if needed
		this.pruneOldMessages();
	}

	/**
	 * Create button container with interactive buttons
	 */
	createButtonContainer(buttons) {
		const container = document.createElement('div');
		container.className = 'button-container';
		container.style.opacity = '0';
		container.style.transition = 'opacity 0.3s ease';

		// Featured state buttons
		if (buttons.featured) {
			const buttonRow = document.createElement('div');
			buttonRow.className = 'button-row';

			buttons.featured.forEach(state => {
				const btn = this.createButton(state, () => {
					this.sendUserMessage(state, false);
				});
				buttonRow.appendChild(btn);
			});

			container.appendChild(buttonRow);
		}

		// State dropdown
		if (buttons.dropdown) {
			const dropdown = this.createStateDropdown((state) => {
				this.sendUserMessage(state, false);
			});
			container.appendChild(dropdown);
		}

		// Topic buttons
		if (buttons.topics) {
			const buttonRow = document.createElement('div');
			buttonRow.className = 'button-row';

			buttons.topics.forEach(topic => {
				const btn = this.createButton(topic.name, () => {
					this.sendUserMessage(topic.name, false);
				});
				buttonRow.appendChild(btn);
			});

			container.appendChild(buttonRow);
		}

		return container;
	}

	/**
	 * Animate bot reply word-by-word
	 * Implements Requirements: 5.5, 7.3, 7.4, 7.5
	 * @param {HTMLElement} bubble - The bot bubble element
	 * @param {string} text - The message text to animate
	 * @param {HTMLElement} buttonContainer - Optional button container to show after animation
	 */
	animateBotReplyWordByWord(bubble, text, buttonContainer = null) {
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

				// Show buttons if provided
				if (buttonContainer) {
					setTimeout(() => {
						buttonContainer.style.opacity = '1';
					}, 100);
				}

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

			// Don't auto-scroll during animation - let user scroll freely
			// Only scroll if user is near bottom
			const container = this.messagesContainer;
			const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
			if (isNearBottom) {
				this.scrollToBottom();
			}

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
	 * Prune conversation history to maintain performance
	 * Implements Requirement: 13.5
	 */
	pruneConversationHistory() {
		// Keep only the last 2 conversations (4 messages: 2 user + 2 assistant)
		const maxMessages = 4;
		if (this.conversationHistory.length > maxMessages) {
			this.conversationHistory = this.conversationHistory.slice(-maxMessages);
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

		// Append elements to bubble (no timestamp for bot)
		bubble.appendChild(logo);
		bubble.appendChild(bubbleContent);

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
		wordDelay: 2,
		punctuationPause: 250,
		maxMessages: 200
	});
});
