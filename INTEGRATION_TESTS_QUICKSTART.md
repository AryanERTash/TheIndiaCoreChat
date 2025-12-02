# Integration Tests - Quick Start Guide

## 🚀 Getting Started

This guide will help you run the integration tests for the TheIndiaCore chatbot's new features.

---

## 📋 What's Being Tested

The integration test suite covers four major feature areas:

1. **Conversation History** (Task 11)
   - History builds up correctly
   - Context is maintained
   - History is pruned after 50 messages
   - History is sent with API requests

2. **Language Selection** (Task 12)
   - Language selector is functional
   - Selected language is stored
   - System prompt includes language instruction
   - Language can be switched mid-conversation

3. **Topic Display** (Task 13)
   - TOPICS mapping contains all names
   - Topic buttons display names (not IDs)
   - Topic headings use names (not IDs)
   - No numeric IDs visible in UI

4. **End-to-End Flow** (Task 15.4)
   - Language persists through complete flow
   - History maintains context
   - Topic names display correctly
   - Error handling works

---

## 🎯 Running the Tests

### Method 1: Visual Test Runner (Recommended)

1. **Start a local web server:**
   ```bash
   python3 -m http.server 8080
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:8080/integration-tests.html
   ```

3. **Run the tests:**
   - Click **"▶ Run All Tests"** to execute all 16 tests
   - Or click individual buttons to test specific features:
     - **Test Conversation History** (4 tests)
     - **Test Language Selection** (4 tests)
     - **Test Topic Display** (4 tests)
     - **Test End-to-End Flow** (4 tests)

4. **View results:**
   - Watch the real-time status updates
   - Check the summary at the bottom (Total, Passed, Failed, Pending)
   - Read the detailed logs in the console area

### Method 2: Code Verification Script

This script verifies that all features are properly implemented in the codebase:

```bash
node verify-integration.js
```

**Expected output:**
```
🔍 Verifying Integration Test Implementation...

📝 Testing Conversation History Implementation:
✅ conversationHistory array exists
✅ maxHistoryMessages configuration exists
✅ pruneConversationHistory method exists
...

📊 Test Summary:
Total Tests: 21
✅ Passed: 21
❌ Failed: 0
Success Rate: 100.0%

🎉 All integration features are properly implemented!
```

---

## 📁 Test Files

### Main Test Files
- **`integration-tests.html`** - Visual test runner interface
- **`integration-tests.js`** - Test implementation and logic
- **`verify-integration.js`** - Code verification script

### Documentation
- **`INTEGRATION_TEST_REPORT.md`** - Comprehensive test report
- **`INTEGRATION_TESTS_QUICKSTART.md`** - This file

---

## 🎨 Understanding the Test UI

### Status Indicators

- **⏳ Yellow Clock** - Test is pending (not yet run)
- **⟳ Blue Spinner** - Test is currently running
- **✓ Green Checkmark** - Test passed successfully
- **✗ Red X** - Test failed

### Test Groups

Each test group has a colored status badge:
- **PENDING** (Yellow) - Tests not yet run
- **RUNNING** (Blue) - Tests in progress
- **PASSED** (Green) - All tests in group passed
- **FAILED** (Red) - One or more tests failed

### Summary Panel

At the bottom of the page, you'll see:
- **Total Tests** - Total number of tests (16)
- **Passed** - Number of tests that passed (green)
- **Failed** - Number of tests that failed (red)
- **Pending** - Number of tests not yet run (yellow)

### Log Console

The black console at the bottom shows:
- Real-time test execution logs
- Success messages (green border)
- Error messages (red border)
- Info messages (blue border)
- Timestamps for each entry

---

## 🔍 Test Details

### Conversation History Tests (4 tests)

1. **History builds up with multiple messages**
   - Verifies that messages are added to history array
   - Checks structure: role, content, timestamp

2. **Context is maintained across messages**
   - Validates proper message structure
   - Ensures roles are 'user' or 'assistant'

3. **History is pruned after 50 messages**
   - Tests pruning mechanism
   - Verifies only 50 most recent messages kept

4. **History is sent with API requests**
   - Tests JSON serialization
   - Verifies URL encoding/decoding

### Language Selection Tests (4 tests)

1. **Language selector is present and functional**
   - Checks for language dropdown in UI
   - Verifies multiple language options

2. **Selected language is stored correctly**
   - Tests language state management
   - Verifies variable updates

3. **System prompt includes language instruction**
   - Validates prompt generation
   - Checks for "IMPORTANT" keyword

4. **Language can be switched mid-conversation**
   - Tests language switching
   - Verifies new language applies

### Topic Display Tests (4 tests)

1. **TOPICS mapping contains all topic names**
   - Verifies 8 topics defined
   - Checks all have valid names

2. **Topic buttons display names not IDs**
   - Tests button text generation
   - Ensures no numeric IDs

3. **Topic headings use names not IDs**
   - Validates heading format
   - Checks for topic names

4. **No numeric IDs visible in UI**
   - Comprehensive UI check
   - Ensures all elements use names

### End-to-End Tests (4 tests)

1. **Language selection persists through flow**
   - Tests complete user journey
   - Verifies language consistency

2. **Conversation history maintains context**
   - Tests history through flow
   - Verifies context preservation

3. **Topic names display correctly throughout**
   - Tests topic display in flow
   - Ensures name consistency

4. **Error handling works correctly**
   - Tests error responses
   - Verifies graceful degradation

---

## 🐛 Troubleshooting

### Tests Won't Run

**Problem:** Clicking "Run All Tests" does nothing

**Solutions:**
1. Check browser console for JavaScript errors
2. Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
3. Try refreshing the page
4. Clear browser cache

### Server Won't Start

**Problem:** `python3 -m http.server 8080` fails

**Solutions:**
1. Check if port 8080 is already in use:
   ```bash
   lsof -i :8080  # On Mac/Linux
   netstat -ano | findstr :8080  # On Windows
   ```
2. Try a different port:
   ```bash
   python3 -m http.server 8081
   ```
3. Ensure Python 3 is installed:
   ```bash
   python3 --version
   ```

### Verification Script Fails

**Problem:** `node verify-integration.js` shows errors

**Solutions:**
1. Ensure Node.js is installed:
   ```bash
   node --version
   ```
2. Check that all files are in the correct locations
3. Verify file permissions

### Tests Fail Unexpectedly

**Problem:** Some tests show red X marks

**Solutions:**
1. Check the log console for error details
2. Verify that the main application files haven't been modified
3. Ensure all dependencies are loaded (marked.js, DOMPurify)
4. Try running tests individually to isolate the issue

---

## 📊 Expected Results

When all tests pass, you should see:

### Visual Test Runner
- All 16 tests with green checkmarks ✓
- All 4 test groups showing "PASSED" status
- Summary showing: 16 Total, 16 Passed, 0 Failed, 0 Pending
- Green success messages in the log console

### Verification Script
- 21/21 tests passed
- 100% success rate
- "🎉 All integration features are properly implemented!" message

---

## 🔄 Running Tests During Development

### Continuous Testing

While developing new features:

1. Keep the test runner open in a browser tab
2. Make code changes
3. Click "Clear Results" button
4. Click "Run All Tests" to verify changes
5. Fix any failing tests
6. Repeat

### Automated Verification

Add to your development workflow:

```bash
# Before committing changes
node verify-integration.js

# If all tests pass, commit
git add .
git commit -m "Your commit message"
```

---

## 📝 Adding New Tests

To add new tests to the suite:

1. **Open `integration-tests.js`**

2. **Add a new test method:**
   ```javascript
   async testYourNewFeature() {
       try {
           // Your test logic here
           if (condition) {
               this.markPassed('test-id', 'Test passed message');
           } else {
               this.markFailed('test-id', 'Test failed message');
           }
       } catch (error) {
           this.markFailed('test-id', `Error: ${error.message}`);
       }
   }
   ```

3. **Add test item to HTML:**
   ```html
   <div class="test-item" data-test="test-id">
       <div class="test-name">Your test description</div>
       <div class="test-status">
           <div class="status-icon icon-pending">⏳</div>
       </div>
   </div>
   ```

4. **Call your test in the appropriate test group:**
   ```javascript
   async runYourTestGroup() {
       this.updateTestStatus('test-id', 'running');
       await this.testYourNewFeature();
   }
   ```

---

## 🎓 Best Practices

### When Running Tests

1. **Run all tests** before committing code changes
2. **Check the logs** for detailed error messages
3. **Test in multiple browsers** for compatibility
4. **Clear results** between test runs for accurate results

### When Writing Tests

1. **Keep tests focused** - One test per feature
2. **Use descriptive names** - Clear test descriptions
3. **Add error handling** - Catch and report errors properly
4. **Update documentation** - Keep test reports current

### When Debugging

1. **Run tests individually** - Isolate failing tests
2. **Check browser console** - Look for JavaScript errors
3. **Verify file paths** - Ensure all files are accessible
4. **Test incrementally** - Test small changes frequently

---

## 📞 Support

If you encounter issues:

1. Check the **INTEGRATION_TEST_REPORT.md** for detailed test information
2. Review the **troubleshooting section** above
3. Check browser console for error messages
4. Verify all files are present and unmodified

---

## ✅ Checklist

Before considering integration testing complete:

- [ ] All 16 tests pass in visual test runner
- [ ] Verification script shows 100% success rate
- [ ] Tests run successfully in Chrome
- [ ] Tests run successfully in Firefox
- [ ] Tests run successfully in Safari (if available)
- [ ] No console errors during test execution
- [ ] All test groups show "PASSED" status
- [ ] Documentation is up to date

---

## 🎉 Success!

If all tests pass, congratulations! The integration of new features is complete and verified:

✅ Conversation history management working  
✅ Language-aware API communication working  
✅ Topic display with names working  
✅ End-to-end flows working  

You're ready to deploy! 🚀

---

**Last Updated:** November 22, 2025  
**Test Suite Version:** 1.0  
**Status:** All Tests Passing ✅
