#!/usr/bin/env node

/**
 * Implementation Verification Script
 * Verifies that all required files and code elements exist
 */

const fs = require('fs');
const path = require('path');

const results = {
    passed: [],
    failed: [],
    warnings: []
};

function test(name, condition, message = '') {
    if (condition) {
        results.passed.push({ name, message });
        console.log(`✓ ${name}`);
    } else {
        results.failed.push({ name, message });
        console.log(`✗ ${name}${message ? ': ' + message : ''}`);
    }
}

function warn(name, message) {
    results.warnings.push({ name, message });
    console.log(`⚠ ${name}: ${message}`);
}

console.log('🧪 TheIndiaCore Chatbot - Implementation Verification\n');
console.log('=' .repeat(60));

// Test 1: File Structure
console.log('\n📁 File Structure Tests');
console.log('-'.repeat(60));

test('index.html exists', fs.existsSync('index.html'));
test('assets/css/style.css exists', fs.existsSync('assets/css/style.css'));
test('assets/js/chat.js exists', fs.existsSync('assets/js/chat.js'));
test('assets/img/theindiacore.png exists', fs.existsSync('assets/img/theindiacore.png'));
test('assets/img/theindiacore.ico exists', fs.existsSync('assets/img/theindiacore.ico'));
test('README.md exists', fs.existsSync('README.md'));

// Test 2: HTML Structure
console.log('\n📄 HTML Structure Tests');
console.log('-'.repeat(60));

const html = fs.readFileSync('index.html', 'utf8');

test('HTML has DOCTYPE', html.includes('<!DOCTYPE html>'));
test('HTML has viewport meta tag', html.includes('viewport'));
test('HTML has charset meta tag', html.includes('charset'));
test('HTML has favicon link', html.includes('theindiacore.ico'));
test('HTML includes Roboto font', html.includes('Roboto'));
test('HTML includes Material Icons', html.includes('Material+Icons'));
test('HTML includes marked.js CDN', html.includes('marked'));
test('HTML includes DOMPurify CDN', html.includes('dompurify'));
test('HTML has messages container', html.includes('id="messages"'));
test('HTML has input textarea', html.includes('id="input"'));
test('HTML has send button', html.includes('id="sendBtn"'));
test('HTML has aria-live on messages', html.includes('aria-live="polite"'));
test('HTML has aria-label on input', html.includes('aria-label="Message input"'));
test('HTML has aria-label on button', html.includes('aria-label="Send"'));
test('HTML has header card', html.includes('header-card'));
test('HTML has chat card', html.includes('chat-card'));
test('HTML has composer', html.includes('composer'));

// Test 3: CSS Implementation
console.log('\n🎨 CSS Implementation Tests');
console.log('-'.repeat(60));

const css = fs.readFileSync('assets/css/style.css', 'utf8');

// Design tokens
test('CSS has color variables', css.includes('--bg:') && css.includes('--accent:'));
test('CSS has layout variables', css.includes('--max-width-pc:'));
test('CSS has typography variables', css.includes('--font-family:'));
test('CSS has spacing variables', css.includes('--spacing-'));
test('CSS has animation variables', css.includes('--transition-'));

// Layout
test('CSS has flexbox layout', css.includes('display: flex'));
test('CSS has responsive breakpoints', css.includes('@media'));
test('CSS has mobile breakpoint (768px)', css.includes('768px'));

// Components
test('CSS has bubble styles', css.includes('.bubble'));
test('CSS has user bubble styles', css.includes('.bubble-user'));
test('CSS has bot bubble styles', css.includes('.bubble-bot'));
test('CSS has error bubble styles', css.includes('.bubble-error'));
test('CSS has typing indicator styles', css.includes('.typing-indicator'));
test('CSS has speech bubble tails', css.includes('::after') || css.includes('::before'));

// Scrollbar
test('CSS has custom scrollbar (WebKit)', css.includes('::-webkit-scrollbar'));
test('CSS has scrollbar-width for Firefox', css.includes('scrollbar-width'));
test('CSS has scrollbar-color for Firefox', css.includes('scrollbar-color'));

// Animation
test('CSS has dot-jump animation', css.includes('@keyframes dot-jump'));
test('CSS has animation on dots', css.includes('animation:') && css.includes('dot-jump'));

// Composer
test('CSS has composer styles', css.includes('.composer'));
test('CSS has textarea styles', css.includes('.composer-input'));
test('CSS has send button styles', css.includes('.composer-send'));

// Markdown
test('CSS has markdown content styles', css.includes('.bubble-content'));

// Test 4: JavaScript Implementation
console.log('\n⚙️  JavaScript Implementation Tests');
console.log('-'.repeat(60));

const js = fs.readFileSync('assets/js/chat.js', 'utf8');

// Classes
test('JS has ChatController class', js.includes('class ChatController'));
test('JS has ComposerManager class', js.includes('class ComposerManager'));
test('JS has MarkdownRenderer class', js.includes('class MarkdownRenderer'));

// DUMMY_REPLIES
test('JS has DUMMY_REPLIES object', js.includes('DUMMY_REPLIES'));
test('JS has "hello" response', js.includes("'hello'") && js.includes('IndiaCore assistant'));
test('JS has "show features" response', js.includes("'show features'"));
test('JS has "error test" response', js.includes("'error test'"));
test('JS has "markdown test" response', js.includes("'markdown test'"));
test('JS has "_default" response', js.includes("'_default'"));

// ChatController methods
test('JS has constructor', js.includes('constructor('));
test('JS has init method', js.includes('init()'));
test('JS has sendUserMessage method', js.includes('sendUserMessage'));
test('JS has simulateBotReply method', js.includes('simulateBotReply'));
test('JS has createUserBubble method', js.includes('createUserBubble'));
test('JS has createBotBubble method', js.includes('createBotBubble'));
test('JS has createErrorBubble method', js.includes('createErrorBubble'));
test('JS has createTypingIndicator method', js.includes('createTypingIndicator'));
test('JS has removeTypingIndicator method', js.includes('removeTypingIndicator'));
test('JS has animateBotReplyWordByWord method', js.includes('animateBotReplyWordByWord'));
test('JS has scrollToBottom method', js.includes('scrollToBottom'));
test('JS has pruneOldMessages method', js.includes('pruneOldMessages'));
test('JS has enableSend method', js.includes('enableSend'));
test('JS has disableSend method', js.includes('disableSend'));

// ComposerManager methods
test('JS has autoResize method', js.includes('autoResize'));
test('JS has reset method', js.includes('reset'));

// MarkdownRenderer methods
test('JS has render method', js.includes('render('));

// Event listeners
test('JS has keyboard event listener', js.includes('keydown'));
test('JS has input event listener', js.includes('input'));
test('JS has click event listener', js.includes('click'));

// Keyboard handling
test('JS handles Enter key', js.includes('Enter'));
test('JS handles Shift key', js.includes('shiftKey'));

// Markdown and sanitization
test('JS uses marked.js', js.includes('marked'));
test('JS uses DOMPurify', js.includes('DOMPurify'));
test('JS sanitizes HTML', js.includes('sanitize'));

// ARIA attributes
test('JS sets role attributes', js.includes('role'));
test('JS sets aria-label attributes', js.includes('aria-label'));

// Animation
test('JS uses requestAnimationFrame', js.includes('requestAnimationFrame'));
test('JS has word delay logic', js.includes('wordDelay'));
test('JS has punctuation pause logic', js.includes('punctuationPause'));

// State management
test('JS has isProcessing flag', js.includes('isProcessing'));
test('JS has messageCount tracking', js.includes('messageCount'));
test('JS has maxMessages limit', js.includes('maxMessages'));

// Initialization
test('JS initializes on DOMContentLoaded', js.includes('DOMContentLoaded'));

// Test 5: Requirements Coverage
console.log('\n📋 Requirements Coverage Tests');
console.log('-'.repeat(60));

// Check for requirement comments in code
const requirementPattern = /Requirements?:\s*[\d\.,\s]+/gi;
const jsRequirements = js.match(requirementPattern) || [];
const cssRequirements = css.match(requirementPattern) || [];

test('JS has requirement comments', jsRequirements.length > 0, 
    `Found ${jsRequirements.length} requirement references`);
test('CSS has requirement comments', cssRequirements.length > 0,
    `Found ${cssRequirements.length} requirement references`);

// Test 6: Security Checks
console.log('\n🔒 Security Implementation Tests');
console.log('-'.repeat(60));

test('JS sanitizes user input', js.includes('DOMPurify.sanitize'));
test('JS has ALLOWED_TAGS allowlist', js.includes('ALLOWED_TAGS'));
test('JS has ALLOWED_ATTR allowlist', js.includes('ALLOWED_ATTR'));
test('JS adds noopener noreferrer to links', 
    js.includes('noopener') && js.includes('noreferrer'));
test('JS validates input length', js.includes('2000'));
test('JS trims whitespace', js.includes('trim()'));

// Test 7: Accessibility Checks
console.log('\n♿ Accessibility Implementation Tests');
console.log('-'.repeat(60));

test('HTML has semantic elements', html.includes('<button') && html.includes('<textarea'));
test('HTML has proper ARIA attributes', 
    html.includes('aria-live') && html.includes('aria-label'));
test('JS creates accessible bubbles', 
    js.includes('role="article"') || js.includes("role='article'"));
test('JS creates accessible errors', 
    js.includes('role="status"') || js.includes("role='status'"));
test('CSS has focus styles', css.includes(':focus'));

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`✓ Passed: ${results.passed.length}`);
console.log(`✗ Failed: ${results.failed.length}`);
console.log(`⚠ Warnings: ${results.warnings.length}`);
console.log(`Total: ${results.passed.length + results.failed.length}`);

if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(f => {
        console.log(`  - ${f.name}${f.message ? ': ' + f.message : ''}`);
    });
}

if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(w => {
        console.log(`  - ${w.name}: ${w.message}`);
    });
}

const passRate = (results.passed.length / (results.passed.length + results.failed.length) * 100).toFixed(1);
console.log(`\n📈 Pass Rate: ${passRate}%`);

if (results.failed.length === 0) {
    console.log('\n✅ All implementation tests passed!');
    process.exit(0);
} else {
    console.log('\n❌ Some tests failed. Please review the implementation.');
    process.exit(1);
}
