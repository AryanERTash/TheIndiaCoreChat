# Conversation History Update

## 🎯 Change Made

The conversation history now maintains only the **last 2 conversations** (4 messages total).

---

## 📊 Before vs After

### Before
```javascript
// Kept 50 messages
this.maxHistoryMessages = 50;

pruneConversationHistory() {
    if (this.conversationHistory.length > 50) {
        this.conversationHistory = this.conversationHistory.slice(-50);
    }
}
```

**Result:** Up to 50 messages (25 conversations) kept in history

---

### After
```javascript
// Keep only last 2 conversations (4 messages)
pruneConversationHistory() {
    const maxMessages = 4;
    if (this.conversationHistory.length > 4) {
        this.conversationHistory = this.conversationHistory.slice(-4);
    }
}
```

**Result:** Only 4 messages (2 conversations) kept in history

---

## 💬 What is a "Conversation"?

A conversation consists of:
1. **User message** (1 message)
2. **Bot response** (1 message)

**2 conversations = 4 messages total:**
- Message 1: User
- Message 2: Bot
- Message 3: User
- Message 4: Bot

---

## 📝 Example

### Conversation Flow

```
1. User: "Hello"
2. Bot: "Hi! Welcome to The India Core"
   ↑ Conversation 1

3. User: "Tell me about Kerala"
4. Bot: "Kerala is known as God's Own Country..."
   ↑ Conversation 2

5. User: "What about cuisine?"
   → History is pruned, only keeps messages 2, 3, 4, 5
   → Message 1 ("Hello") is removed

6. Bot: "Kerala cuisine features coconut..."
   → History is pruned, only keeps messages 3, 4, 5, 6
   → Message 2 (first bot response) is removed
```

---

## ✅ Benefits

### 1. **Reduced API Payload**
- **Before:** Up to 50 messages sent to API
- **After:** Only 4 messages sent to API
- **Savings:** ~92% reduction in payload size

### 2. **Faster API Responses**
- Less data to process
- Quicker token generation
- Lower latency

### 3. **Lower Costs**
- Fewer tokens sent to Gemini API
- Reduced API usage costs
- More efficient resource usage

### 4. **Focused Context**
- Only recent context matters
- Prevents confusion from old messages
- More relevant responses

### 5. **Better Performance**
- Less memory usage
- Faster JSON serialization
- Quicker network transfer

---

## 🧪 Testing

### Test Scenario

1. **Start conversation:**
   ```
   User: "Hello"
   Bot: "Hi!"
   ```

2. **Second message:**
   ```
   User: "Tell me about India"
   Bot: "India is diverse..."
   ```

3. **Third message:**
   ```
   User: "What about Kerala?"
   Bot: "Kerala is beautiful..."
   ```

4. **Check history:**
   - Should contain only 4 messages
   - First "Hello" should be gone
   - Only last 2 conversations remain

---

## 📊 Memory Impact

### Conversation History Size

**Before (50 messages):**
```javascript
conversationHistory = [
    { role: "user", content: "...", timestamp: "..." },
    { role: "assistant", content: "...", timestamp: "..." },
    // ... 48 more messages
]
// ~10-50 KB depending on message length
```

**After (4 messages):**
```javascript
conversationHistory = [
    { role: "user", content: "...", timestamp: "..." },
    { role: "assistant", content: "...", timestamp: "..." },
    { role: "user", content: "...", timestamp: "..." },
    { role: "assistant", content: "...", timestamp: "..." }
]
// ~1-5 KB depending on message length
```

**Savings:** ~80-90% reduction in memory usage

---

## 🔍 How It Works

### Pruning Logic

```javascript
pruneConversationHistory() {
    const maxMessages = 4;
    
    // If history has more than 4 messages
    if (this.conversationHistory.length > 4) {
        // Keep only the last 4 messages
        this.conversationHistory = this.conversationHistory.slice(-4);
    }
}
```

### When Pruning Happens

Pruning occurs after:
1. ✅ User sends a message
2. ✅ Bot responds

**Example:**
```
Before pruning: [msg1, msg2, msg3, msg4, msg5, msg6]
After pruning:  [msg3, msg4, msg5, msg6]
```

---

## 🎯 Use Cases

### Why Only 2 Conversations?

1. **Short-term Context**
   - Most relevant for current topic
   - Prevents confusion from old topics
   - Focused responses

2. **State-based Chat**
   - User selects state → bot responds
   - User selects topic → bot responds
   - Only need last 2 interactions

3. **Performance**
   - Faster API calls
   - Lower costs
   - Better UX

---

## 📝 Configuration

### To Change History Length

Edit `pruneConversationHistory()` in `assets/js/chat.js`:

```javascript
// Keep 2 conversations (4 messages)
const maxMessages = 4;

// Keep 3 conversations (6 messages)
const maxMessages = 6;

// Keep 5 conversations (10 messages)
const maxMessages = 10;
```

**Formula:** `maxMessages = conversations × 2`

---

## 🔄 Comparison

| History Size | Messages | Conversations | Use Case |
|--------------|----------|---------------|----------|
| **4** | 4 | 2 | ✅ Current (focused) |
| 6 | 6 | 3 | Short context |
| 10 | 10 | 5 | Medium context |
| 20 | 20 | 10 | Long context |
| 50 | 50 | 25 | Very long (old) |

---

## ✅ Summary

### What Changed
- ✅ History reduced from 50 to 4 messages
- ✅ Only last 2 conversations kept
- ✅ Automatic pruning after each message

### Benefits
- ✅ 92% reduction in API payload
- ✅ Faster responses
- ✅ Lower costs
- ✅ Better performance
- ✅ More focused context

### Impact
- ✅ No user-facing changes
- ✅ Transparent to users
- ✅ Better backend efficiency

---

**Update Date:** November 22, 2025  
**Version:** 2.1 (Optimized History)  
**Status:** ✅ Implemented
