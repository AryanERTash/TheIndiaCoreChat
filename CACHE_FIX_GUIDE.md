# Fix: 405 Method Not Allowed Error

## 🐛 Problem

You're seeing this error:
```
405 (Method Not Allowed)
```

**Cause:** Your browser has cached the old JavaScript file that uses GET requests. The server now expects POST requests.

---

## ✅ Solution: Clear Browser Cache

### Option 1: Hard Refresh (Quickest)

**Windows/Linux:**
- Press `Ctrl + Shift + R`
- Or `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + R`
- Or `Cmd + Option + R`

---

### Option 2: Clear Cache in DevTools

1. Open DevTools (`F12`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

---

### Option 3: Disable Cache (Development)

1. Open DevTools (`F12`)
2. Go to Network tab
3. Check "Disable cache"
4. Keep DevTools open
5. Refresh page

---

### Option 4: Clear Browser Cache Manually

**Chrome:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"

---

## 🧪 Verify the Fix

After clearing cache:

1. **Open DevTools** (`F12`)
2. **Go to Network tab**
3. **Refresh the page**
4. **Click "Say Hi"**
5. **Look for the `/chat` request**

You should see:
```
Request Method: POST  ✅
Status Code: 200 OK   ✅
```

**NOT:**
```
Request Method: GET   ❌
Status Code: 405      ❌
```

---

## 🔍 Check Request Details

In DevTools Network tab, click on the `/chat` request:

**Headers tab should show:**
```
Request URL: https://your-domain/chat
Request Method: POST
Content-Type: application/json
```

**Payload tab should show:**
```json
{
  "message": "...",
  "system_prompt": "...",
  "history": []
}
```

---

## 🚀 Alternative: Restart Server

If cache clearing doesn't work:

1. **Stop the server** (`Ctrl + C`)
2. **Clear browser cache**
3. **Restart server:**
   ```bash
   uvicorn app:app --reload
   ```
4. **Refresh browser** (hard refresh)

---

## 📝 For Developers

### Add Cache-Busting

To prevent this in future, add version to script tag:

**In `index.html`:**
```html
<!-- Before -->
<script src="assets/js/chat.js"></script>

<!-- After -->
<script src="assets/js/chat.js?v=2.0"></script>
```

Change version number when you update the file.

---

## ✅ Success Indicators

After fixing, you should see:

1. ✅ No 405 errors in console
2. ✅ POST requests in Network tab
3. ✅ Bot responds to "Say Hi"
4. ✅ Chat works normally

---

## 🎯 Quick Fix Summary

1. **Hard refresh:** `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. **Verify:** Check Network tab shows POST requests
3. **Test:** Click "Say Hi" and verify bot responds

That's it! 🎉
