/**
 * Quick Verification Script for Integration Tests
 * Validates that all required features are implemented in the codebase
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Integration Test Implementation...\n');

// Read the main chat.js file
const chatJsPath = path.join(__dirname, 'assets', 'js', 'chat.js');
const chatJsContent = fs.readFileSync(chatJsPath, 'utf8');

// Read the backend endpoint file
const endpointPath = path.join(__dirname, 'gemini_endpoint.py');
const endpointContent = fs.readFileSync(endpointPath, 'utf8');

// Read the index.html file
const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
    if (condition) {
        console.log(`✅ ${name}`);
        if (details) console.log(`   ${details}`);
        passed++;
    } else {
        console.log(`❌ ${name}`);
        if (details) console.log(`   ${details}`);
        failed++;
    }
}

console.log('📝 Testing Conversation History Implementation:\n');

test(
    'conversationHistory array exists',
    chatJsContent.includes('this.conversationHistory = []'),
    'Found in ChatController constructor'
);

test(
    'maxHistoryMessages configuration exists',
    chatJsContent.includes('this.maxHistoryMessages'),
    'Found maxHistoryMessages property'
);

test(
    'pruneConversationHistory method exists',
    chatJsContent.includes('pruneConversationHistory()'),
    'Found pruning method'
);

test(
    'History added for user messages',
    chatJsContent.includes("role: 'user'") && chatJsContent.includes('conversationHistory.push'),
    'Found user message history addition'
);

test(
    'History added for assistant messages',
    chatJsContent.includes("role: 'assistant'") && chatJsContent.includes('conversationHistory.push'),
    'Found assistant message history addition'
);

test(
    'History sent with API calls',
    chatJsContent.includes('JSON.stringify(this.conversationHistory)') && 
    chatJsContent.includes('encodeURIComponent'),
    'Found history encoding for API'
);

console.log('\n🌐 Testing Language Selection Implementation:\n');

test(
    'selectedLanguage variable exists',
    chatJsContent.includes('this.selectedLanguage'),
    'Found selectedLanguage property'
);

test(
    'Language selector in HTML',
    indexContent.includes('id="languageSelect"') && indexContent.includes('<option value='),
    'Found language dropdown in HTML'
);

test(
    'attachLanguageSelector method exists',
    chatJsContent.includes('attachLanguageSelector()'),
    'Found language selector attachment'
);

test(
    'getSelectedLanguageName method exists',
    chatJsContent.includes('getSelectedLanguageName()'),
    'Found language name getter'
);

test(
    'System prompt includes language',
    chatJsContent.includes('IMPORTANT: You MUST respond in') && 
    chatJsContent.includes('${languageName}'),
    'Found language instruction in system prompt'
);

test(
    'Language passed to API',
    chatJsContent.includes('sys=${encodeURIComponent(systemPrompt)}'),
    'Found system prompt in API call'
);

console.log('\n🏷️ Testing Topic Display Implementation:\n');

test(
    'TOPICS mapping exists',
    chatJsContent.includes('const TOPICS = {') && 
    chatJsContent.includes("'1': 'Interesting Facts'"),
    'Found TOPICS constant with mappings'
);

test(
    'All 8 topics defined',
    chatJsContent.includes("'1':") && chatJsContent.includes("'2':") && 
    chatJsContent.includes("'3':") && chatJsContent.includes("'4':") &&
    chatJsContent.includes("'5':") && chatJsContent.includes("'6':") &&
    chatJsContent.includes("'7':") && chatJsContent.includes("'8':"),
    'Found all 8 topic IDs'
);

test(
    'Topic names used in buttons',
    chatJsContent.includes('topic.name') || chatJsContent.includes('TOPICS['),
    'Found topic name usage'
);

test(
    'Topic names used in headings',
    chatJsContent.includes('TOPICS[topicId]') || chatJsContent.includes('topicName'),
    'Found topic name in headings'
);

console.log('\n🔧 Testing Backend Endpoint Implementation:\n');

test(
    'History parameter in endpoint',
    endpointContent.includes('history: str = Query'),
    'Found history parameter in endpoint'
);

test(
    'System prompt parameter in endpoint',
    endpointContent.includes('sys: str = Query'),
    'Found sys parameter in endpoint'
);

test(
    'History parsing in endpoint',
    endpointContent.includes('json.loads') && endpointContent.includes('unquote'),
    'Found history parsing logic'
);

test(
    'LangChain message conversion',
    endpointContent.includes('HumanMessage') && endpointContent.includes('AIMessage'),
    'Found message conversion for LangChain'
);

test(
    'History added to prompt',
    endpointContent.includes('conversation_history') && endpointContent.includes('messages'),
    'Found history integration in prompt'
);

console.log('\n📊 Test Summary:\n');
console.log(`Total Tests: ${passed + failed}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
    console.log('\n🎉 All integration features are properly implemented!');
    process.exit(0);
} else {
    console.log('\n⚠️  Some features may need attention.');
    process.exit(1);
}
