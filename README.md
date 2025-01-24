# Lightning Web Components

Understanding web development terminologies

1. **Cookies**:
Cookies are small pieces of data that a web server can send to a user's web browser. The browser stores this data and sends it back to the server with subsequent requests. Cookies are often used for various purposes, such as maintaining user sessions, remembering user preferences, and tracking user behavior.

Example:
```javascript
// Set a cookie that expires in 7 days
document.cookie = "username=John; expires=" + new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
```

2. **Session**:
A session is a period of user interaction with a web application. Sessions are often used to maintain user-specific data across multiple requests. Session data is typically stored on the server, and a session identifier (usually stored in a cookie) is used to associate the client with their session data.

Example (using Express.js, a Node.js framework):
```javascript
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.get('/setSession', (req, res) => {
  req.session.username = 'John';
  res.send('Session data set');
});

app.get('/getSession', (req, res) => {
  const username = req.session.username || 'Guest';
  res.send('Hello, ' + username);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

3. **Local Storage**:
Local storage is a web storage API that allows you to store key-value pairs in a user's web browser. Data stored in local storage persists even after the browser is closed and can be accessed on subsequent visits to the same website.

Example:
```javascript
// Store data in local storage
localStorage.setItem('username', 'John');

// Retrieve data from local storage
const username = localStorage.getItem('username');
console.log('Hello, ' + username);
```

4. **Session Storage**:
Session storage is similar to local storage but is limited to the lifetime of a single browser tab or window. Data stored in session storage is only available while the tab/window is open and is cleared when the tab/window is closed.

Example:
```javascript
// Store data in session storage
sessionStorage.setItem('username', 'John');

// Retrieve data from session storage
const username = sessionStorage.getItem('username');
console.log('Hello, ' + username);
```







Content asset files, SVG, static resources can be accessed from LWC.



event.preventDefault() →  prevents the default behavior of an element from happening.
event.stopPropagation() → prevents an event from bubbling up the event chain.
