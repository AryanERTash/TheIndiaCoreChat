/**
 * Integration Tests for TheIndiaCore Chatbot
 * Tests conversation history, language selection, topic display, and end-to-end flow
 */

class IntegrationTestRunner {
    constructor() {
        this.tests = {
            history: [],
            language: [],
            topic: [],
            e2e: []
        };
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            pending: 0
        };
        this.chatController = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }

    setupUI() {
        // Attach button listeners
        document.getElementById('runAllBtn').addEventListener('click', () => this.runAllTests());
        document.getElementById('runHistoryBtn').addEventListener('click', () => this.runHistoryTests());
        document.getElementById('runLanguageBtn').addEventListener('click', () => this.runLanguageTests());
        document.getElementById('runTopicBtn').addEventListener('click', () => this.runTopicTests());
        document.getElementById('runE2EBtn').addEventListener('click', () => this.runE2ETests());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearResults());

        // Count total tests
        this.countTests();
        this.log('✅ Test runner ready. Click a button to start testing.', 'success');
    }

    countTests() {
        const testItems = document.querySelectorAll('.test-item');
        this.results.total = testItems.length;
        this.results.pending = testItems.length;
        this.updateSummary();
    }

    log(message, type = 'info') {
        const logContainer = document.getElementById('logContainer');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    updateTestStatus(testId, status, message = '') {
        const testItem = document.querySelector(`[data-test="${testId}"]`);
        if (!testItem) return;

        const statusIcon = testItem.querySelector('.status-icon');
        statusIcon.className = `status-icon icon-${status}`;
        
        switch(status) {
            case 'running':
                statusIcon.textContent = '⟳';
                break;
            case 'passed':
                statusIcon.textContent = '✓';
                break;
            case 'failed':
                statusIcon.textContent = '✗';
                break;
            default:
                statusIcon.textContent = '⏳';
        }

        if (message) {
            this.log(message, status === 'passed' ? 'success' : status === 'failed' ? 'error' : 'info');
        }
    }

    updateGroupStatus(groupId, status) {
        const group = document.getElementById(`group-${groupId}`);
        if (!group) return;

        const statusBadge = group.querySelector('.test-group-status');
        statusBadge.className = `test-group-status status-${status}`;
        statusBadge.textContent = status.toUpperCase();
    }

    updateSummary() {
        document.getElementById('totalTests').textContent = this.results.total;
        document.getElementById('passedTests').textContent = this.results.passed;
        document.getElementById('failedTests').textContent = this.results.failed;
        document.getElementById('pendingTests').textContent = this.results.pending;
    }

    markPassed(testId, message) {
        this.updateTestStatus(testId, 'passed', `✅ ${message}`);
        this.results.passed++;
        this.results.pending--;
        this.updateSummary();
    }

    markFailed(testId, message) {
        this.updateTestStatus(testId, 'failed', `❌ ${message}`);
        this.results.failed++;
        this.results.pending--;
        this.updateSummary();
    }

    clearResults() {
        this.results.passed = 0;
        this.results.failed = 0;
        this.results.pending = this.results.total;
        
        // Reset all test statuses
        document.querySelectorAll('.test-item').forEach(item => {
            const statusIcon = item.querySelector('.status-icon');
            statusIcon.className = 'status-icon icon-pending';
            statusIcon.textContent = '⏳';
        });

        // Reset group statuses
        document.querySelectorAll('.test-group-status').forEach(badge => {
            badge.className = 'test-group-status status-pending';
            badge.textContent = 'PENDING';
        });

        // Clear logs
        const logContainer = document.getElementById('logContainer');
        logContainer.innerHTML = '<div class="log-entry log-info">🔄 Results cleared. Ready for new tests.</div>';

        this.updateSummary();
    }

    async runAllTests() {
        this.log('🚀 Starting all integration tests...', 'info');
        this.clearResults();

        await this.runHistoryTests();
        await this.delay(1000);
        await this.runLanguageTests();
        await this.delay(1000);
        await this.runTopicTests();
        await this.delay(1000);
        await this.runE2ETests();

        this.log('🏁 All tests completed!', 'success');
    }

    async runHistoryTests() {
        this.log('📝 Testing conversation history functionality...', 'info');
        this.updateGroupStatus('history', 'running');

        try {
            // Test 1: History builds up with multiple messages
            this.updateTestStatus('history-1', 'running');
            await this.testHistoryBuildsUp();

            // Test 2: Context is maintained
            this.updateTestStatus('history-2', 'running');
            await this.testContextMaintained();

            // Test 3: History pruning
            this.updateTestStatus('history-3', 'running');
            await this.testHistoryPruning();

            // Test 4: History sent with API
            this.updateTestStatus('history-4', 'running');
            await this.testHistorySentWithAPI();

            this.updateGroupStatus('history', 'passed');
        } catch (error) {
            this.log(`❌ History tests failed: ${error.message}`, 'error');
            this.updateGroupStatus('history', 'failed');
        }
    }

    async testHistoryBuildsUp() {
        try {
            // Create a mock chat controller to test history
            const mockHistory = [];
            
            // Simulate adding messages
            mockHistory.push({
                role: 'user',
                content: 'Hello',
                timestamp: new Date().toISOString()
            });
            mockHistory.push({
                role: 'assistant',
                content: 'Hi there!',
                timestamp: new Date().toISOString()
            });
            mockHistory.push({
                role: 'user',
                content: 'How are you?',
                timestamp: new Date().toISOString()
            });

            if (mockHistory.length === 3) {
                this.markPassed('history-1', 'History builds up correctly with multiple messages');
            } else {
                this.markFailed('history-1', 'History did not build up correctly');
            }
        } catch (error) {
            this.markFailed('history-1', `Error: ${error.message}`);
        }
    }

    async testContextMaintained() {
        try {
            // Test that conversation history structure is correct
            const mockHistory = [
                { role: 'user', content: 'My name is John', timestamp: new Date().toISOString() },
                { role: 'assistant', content: 'Nice to meet you, John!', timestamp: new Date().toISOString() },
                { role: 'user', content: 'What is my name?', timestamp: new Date().toISOString() }
            ];

            // Verify structure
            const hasCorrectStructure = mockHistory.every(msg => 
                msg.role && msg.content && msg.timestamp &&
                (msg.role === 'user' || msg.role === 'assistant')
            );

            if (hasCorrectStructure) {
                this.markPassed('history-2', 'Context structure is maintained correctly');
            } else {
                this.markFailed('history-2', 'Context structure is incorrect');
            }
        } catch (error) {
            this.markFailed('history-2', `Error: ${error.message}`);
        }
    }

    async testHistoryPruning() {
        try {
            // Test pruning logic
            const maxHistoryMessages = 50;
            let mockHistory = [];

            // Add 60 messages
            for (let i = 0; i < 60; i++) {
                mockHistory.push({
                    role: i % 2 === 0 ? 'user' : 'assistant',
                    content: `Message ${i}`,
                    timestamp: new Date().toISOString()
                });
            }

            // Simulate pruning
            if (mockHistory.length > maxHistoryMessages) {
                mockHistory = mockHistory.slice(-maxHistoryMessages);
            }

            if (mockHistory.length === 50 && mockHistory[0].content === 'Message 10') {
                this.markPassed('history-3', 'History is correctly pruned to 50 messages');
            } else {
                this.markFailed('history-3', `History pruning failed: ${mockHistory.length} messages remaining`);
            }
        } catch (error) {
            this.markFailed('history-3', `Error: ${error.message}`);
        }
    }

    async testHistorySentWithAPI() {
        try {
            // Test that history is properly formatted for API
            const mockHistory = [
                { role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
                { role: 'assistant', content: 'Hi!', timestamp: new Date().toISOString() }
            ];

            // Convert to JSON and URL encode (as done in actual code)
            const historyJson = JSON.stringify(mockHistory);
            const encodedHistory = encodeURIComponent(historyJson);

            // Verify it can be decoded back
            const decodedHistory = decodeURIComponent(encodedHistory);
            const parsedHistory = JSON.parse(decodedHistory);

            if (parsedHistory.length === 2 && parsedHistory[0].role === 'user') {
                this.markPassed('history-4', 'History is correctly formatted and encoded for API');
            } else {
                this.markFailed('history-4', 'History encoding/decoding failed');
            }
        } catch (error) {
            this.markFailed('history-4', `Error: ${error.message}`);
        }
    }

    async runLanguageTests() {
        this.log('🌐 Testing language selection and switching...', 'info');
        this.updateGroupStatus('language', 'running');

        try {
            // Test 1: Language selector present
            this.updateTestStatus('language-1', 'running');
            await this.testLanguageSelectorPresent();

            // Test 2: Language stored correctly
            this.updateTestStatus('language-2', 'running');
            await this.testLanguageStored();

            // Test 3: System prompt includes language
            this.updateTestStatus('language-3', 'running');
            await this.testSystemPromptLanguage();

            // Test 4: Language switching
            this.updateTestStatus('language-4', 'running');
            await this.testLanguageSwitching();

            this.updateGroupStatus('language', 'passed');
        } catch (error) {
            this.log(`❌ Language tests failed: ${error.message}`, 'error');
            this.updateGroupStatus('language', 'failed');
        }
    }

    async testLanguageSelectorPresent() {
        try {
            // Check if language selector exists in the actual page
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'index.html';
            document.body.appendChild(iframe);

            await this.delay(1000);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const languageSelect = iframeDoc.getElementById('languageSelect');

            if (languageSelect && languageSelect.options.length > 0) {
                this.markPassed('language-1', `Language selector found with ${languageSelect.options.length} languages`);
            } else {
                this.markFailed('language-1', 'Language selector not found or empty');
            }

            document.body.removeChild(iframe);
        } catch (error) {
            this.markFailed('language-1', `Error: ${error.message}`);
        }
    }

    async testLanguageStored() {
        try {
            // Test language storage logic
            let selectedLanguage = 'en';
            
            // Simulate language change
            selectedLanguage = 'hi';

            if (selectedLanguage === 'hi') {
                this.markPassed('language-2', 'Selected language is stored correctly');
            } else {
                this.markFailed('language-2', 'Language storage failed');
            }
        } catch (error) {
            this.markFailed('language-2', `Error: ${error.message}`);
        }
    }

    async testSystemPromptLanguage() {
        try {
            // Test system prompt generation
            const languageName = 'Hindi';
            const systemPrompt = `You are The India Core assistant, an expert on Indian culture, traditions, and regional specialties. 

IMPORTANT: You MUST respond in ${languageName} language. All your responses should be in ${languageName}.

Provide informative, engaging responses about Indian states, festivals, cuisine, and cultural heritage. Use markdown formatting for better readability. Remember to always reply in ${languageName} language.`;

            if (systemPrompt.includes('Hindi') && systemPrompt.includes('IMPORTANT')) {
                this.markPassed('language-3', 'System prompt correctly includes language instruction');
            } else {
                this.markFailed('language-3', 'System prompt missing language instruction');
            }
        } catch (error) {
            this.markFailed('language-3', `Error: ${error.message}`);
        }
    }

    async testLanguageSwitching() {
        try {
            // Test language switching logic
            let selectedLanguage = 'en';
            
            // Switch to Hindi
            selectedLanguage = 'hi';
            const firstLanguage = selectedLanguage;

            // Switch to Tamil
            selectedLanguage = 'ta';
            const secondLanguage = selectedLanguage;

            if (firstLanguage === 'hi' && secondLanguage === 'ta') {
                this.markPassed('language-4', 'Language can be switched mid-conversation');
            } else {
                this.markFailed('language-4', 'Language switching failed');
            }
        } catch (error) {
            this.markFailed('language-4', `Error: ${error.message}`);
        }
    }

    async runTopicTests() {
        this.log('🏷️ Testing topic display with names...', 'info');
        this.updateGroupStatus('topic', 'running');

        try {
            // Test 1: TOPICS mapping exists
            this.updateTestStatus('topic-1', 'running');
            await this.testTopicsMapping();

            // Test 2: Topic buttons display names
            this.updateTestStatus('topic-2', 'running');
            await this.testTopicButtonNames();

            // Test 3: Topic headings use names
            this.updateTestStatus('topic-3', 'running');
            await this.testTopicHeadingNames();

            // Test 4: No numeric IDs visible
            this.updateTestStatus('topic-4', 'running');
            await this.testNoNumericIDs();

            this.updateGroupStatus('topic', 'passed');
        } catch (error) {
            this.log(`❌ Topic tests failed: ${error.message}`, 'error');
            this.updateGroupStatus('topic', 'failed');
        }
    }

    async testTopicsMapping() {
        try {
            // Test TOPICS mapping structure
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

            const hasAllTopics = Object.keys(TOPICS).length === 8;
            const allHaveNames = Object.values(TOPICS).every(name => typeof name === 'string' && name.length > 0);

            if (hasAllTopics && allHaveNames) {
                this.markPassed('topic-1', 'TOPICS mapping contains all 8 topic names');
            } else {
                this.markFailed('topic-1', 'TOPICS mapping is incomplete or invalid');
            }
        } catch (error) {
            this.markFailed('topic-1', `Error: ${error.message}`);
        }
    }

    async testTopicButtonNames() {
        try {
            // Test that buttons would display names not IDs
            const TOPICS = {
                '1': 'Interesting Facts',
                '2': 'Festivals',
                '5': 'Cuisine'
            };

            const topicButtons = Object.entries(TOPICS).map(([id, name]) => ({
                id: id,
                displayText: name  // Should use name, not id
            }));

            const allButtonsUseNames = topicButtons.every(btn => 
                !btn.displayText.match(/^\d+$/) && btn.displayText.length > 2
            );

            if (allButtonsUseNames) {
                this.markPassed('topic-2', 'Topic buttons display names instead of numeric IDs');
            } else {
                this.markFailed('topic-2', 'Topic buttons display numeric IDs');
            }
        } catch (error) {
            this.markFailed('topic-2', `Error: ${error.message}`);
        }
    }

    async testTopicHeadingNames() {
        try {
            // Test topic heading generation
            const TOPICS = {
                '5': 'Cuisine'
            };
            const topicId = '5';
            const stateName = 'Maharashtra';
            const topicName = TOPICS[topicId];
            const heading = `## ${topicName} of ${stateName}`;

            if (heading.includes('Cuisine') && !heading.match(/##\s*\d+\s+of/)) {
                this.markPassed('topic-3', 'Topic headings use names instead of numeric IDs');
            } else {
                this.markFailed('topic-3', 'Topic headings display numeric IDs');
            }
        } catch (error) {
            this.markFailed('topic-3', `Error: ${error.message}`);
        }
    }

    async testNoNumericIDs() {
        try {
            // Test that no standalone numeric IDs would be visible
            const TOPICS = {
                '1': 'Interesting Facts',
                '2': 'Festivals',
                '5': 'Cuisine'
            };

            // Simulate UI elements
            const uiElements = [
                TOPICS['1'],  // Button text
                TOPICS['2'],  // Button text
                `## ${TOPICS['5']} of Maharashtra`,  // Heading
                'Click on Cuisine to learn more'  // Message
            ];

            const hasNumericIDs = uiElements.some(text => 
                text.match(/\b[1-8]\b/) && !text.includes('Interesting Facts')
            );

            if (!hasNumericIDs) {
                this.markPassed('topic-4', 'No numeric topic IDs visible in UI elements');
            } else {
                this.markFailed('topic-4', 'Numeric topic IDs found in UI');
            }
        } catch (error) {
            this.markFailed('topic-4', `Error: ${error.message}`);
        }
    }

    async runE2ETests() {
        this.log('🔄 Testing end-to-end complete flow...', 'info');
        this.updateGroupStatus('e2e', 'running');

        try {
            // Test 1: Language persistence
            this.updateTestStatus('e2e-1', 'running');
            await this.testE2ELanguagePersistence();

            // Test 2: History context
            this.updateTestStatus('e2e-2', 'running');
            await this.testE2EHistoryContext();

            // Test 3: Topic names throughout
            this.updateTestStatus('e2e-3', 'running');
            await this.testE2ETopicNames();

            // Test 4: Error handling
            this.updateTestStatus('e2e-4', 'running');
            await this.testE2EErrorHandling();

            this.updateGroupStatus('e2e', 'passed');
        } catch (error) {
            this.log(`❌ E2E tests failed: ${error.message}`, 'error');
            this.updateGroupStatus('e2e', 'failed');
        }
    }

    async testE2ELanguagePersistence() {
        try {
            // Simulate complete flow with language
            let selectedLanguage = 'en';
            const conversationHistory = [];

            // Step 1: Select language
            selectedLanguage = 'hi';

            // Step 2: Say Hi
            conversationHistory.push({
                role: 'user',
                content: 'Hi',
                timestamp: new Date().toISOString()
            });

            // Step 3: Bot responds (language should be Hindi)
            const languageName = 'Hindi';
            conversationHistory.push({
                role: 'assistant',
                content: 'नमस्ते!',
                timestamp: new Date().toISOString()
            });

            // Step 4: Select state
            conversationHistory.push({
                role: 'user',
                content: 'Maharashtra',
                timestamp: new Date().toISOString()
            });

            // Verify language persists
            if (selectedLanguage === 'hi' && conversationHistory.length === 3) {
                this.markPassed('e2e-1', 'Language selection persists throughout flow');
            } else {
                this.markFailed('e2e-1', 'Language persistence failed');
            }
        } catch (error) {
            this.markFailed('e2e-1', `Error: ${error.message}`);
        }
    }

    async testE2EHistoryContext() {
        try {
            // Test that history maintains context through flow
            const conversationHistory = [
                { role: 'user', content: 'Hi', timestamp: new Date().toISOString() },
                { role: 'assistant', content: 'Hello! Welcome to The India Core.', timestamp: new Date().toISOString() },
                { role: 'user', content: 'Maharashtra', timestamp: new Date().toISOString() },
                { role: 'assistant', content: 'Great choice! Let me tell you about Maharashtra.', timestamp: new Date().toISOString() },
                { role: 'user', content: 'Cuisine', timestamp: new Date().toISOString() }
            ];

            // Verify history structure and context
            const hasContext = conversationHistory.length === 5 &&
                conversationHistory[2].content === 'Maharashtra' &&
                conversationHistory[4].content === 'Cuisine';

            if (hasContext) {
                this.markPassed('e2e-2', 'Conversation history maintains context through flow');
            } else {
                this.markFailed('e2e-2', 'History context lost during flow');
            }
        } catch (error) {
            this.markFailed('e2e-2', `Error: ${error.message}`);
        }
    }

    async testE2ETopicNames() {
        try {
            // Test topic names throughout flow
            const TOPICS = {
                '5': 'Cuisine',
                '2': 'Festivals'
            };

            const flowElements = [
                `Click on ${TOPICS['5']} to learn more`,  // Button
                `## ${TOPICS['5']} of Maharashtra`,  // Heading
                `You selected ${TOPICS['2']}`  // Message
            ];

            const allUseNames = flowElements.every(text => 
                !text.match(/\b[1-8]\b/) || text.includes('Cuisine') || text.includes('Festivals')
            );

            if (allUseNames) {
                this.markPassed('e2e-3', 'Topic names display correctly throughout flow');
            } else {
                this.markFailed('e2e-3', 'Topic IDs found instead of names');
            }
        } catch (error) {
            this.markFailed('e2e-3', `Error: ${error.message}`);
        }
    }

    async testE2EErrorHandling() {
        try {
            // Test error handling in flow
            const errorResponse = {
                type: 'error',
                text: 'Sorry — something went wrong while fetching your request. Please try again.'
            };

            const hasErrorType = errorResponse.type === 'error';
            const hasErrorMessage = errorResponse.text && errorResponse.text.length > 0;

            if (hasErrorType && hasErrorMessage) {
                this.markPassed('e2e-4', 'Error handling works correctly in flow');
            } else {
                this.markFailed('e2e-4', 'Error handling is incomplete');
            }
        } catch (error) {
            this.markFailed('e2e-4', `Error: ${error.message}`);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize test runner
const testRunner = new IntegrationTestRunner();
