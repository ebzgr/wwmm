# How to Run the Website Properly

## The Cookie Issue

The cookie system wasn't working because you're likely opening the HTML files directly in your browser using the `file://` protocol. **Cookies don't work with the `file://` protocol** - this is a browser security restriction.

## Solutions

### Option 1: Use a Local Web Server (Recommended)

**Python (if you have Python installed):**
```bash
# Navigate to your project folder
cd C:\Users\ebzgr\OneDrive\Projects\CCM

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

**Node.js (if you have Node.js installed):**
```bash
# Install http-server globally
npm install -g http-server

# Navigate to your project folder
cd C:\Users\ebzgr\OneDrive\Projects\CCM

# Start server
http-server
```

**VS Code Live Server Extension:**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 2: Use the Enhanced System (Works with file://)

The system now automatically detects when you're using `file://` protocol and falls back to `localStorage` instead of cookies. This means:

- ✅ **User IDs will persist** across page loads
- ✅ **All tracking will work** 
- ✅ **No server needed**

## What You'll See

**With file:// protocol:**
```
⚠️ File protocol detected - cookies may not work. Using localStorage instead.
🍪 File protocol - checking localStorage first
 Found in localStorage: user_id = [GUID]
👤 Existing user ID found: [GUID]
```

**With http:// protocol:**
```
🍪 Cookie set: user_id = [GUID]
✅ Cookie verification successful
👤 Existing user ID found: [GUID]
```

## Testing

1. **Refresh the page** - should show existing user ID
2. **Navigate between pages** - should keep same user ID
3. **Check console** for detailed logging
4. **Run `testCookieSystem()`** in console for testing

## Current Status

The system now works with both:
- ✅ **file:// protocol** (using localStorage)
- ✅ **http:// protocol** (using cookies)
- ✅ **https:// protocol** (using secure cookies)

No matter how you run it, user IDs will persist! 🚀
