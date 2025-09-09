const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const app = express();
const port = 3000;

const JWT_SECRET = 'your-very-secret-key'; // Hardcoded secret for testing


// Middleware to parse JSON bodies
app.use(express.json());

// Token generation route for testing
app.post('/login', (req, res) => {
    if (req.body.username != process.env.USERNAME || req.body.password != process.env.PASSWORD) {
        console.log(req.body.username);
        console.log(req.body.password);
        console.log(process.env.USERNAME);
        console.log(process.env.PASSWORD);
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(req.body, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});
      
// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/secret', authenticateToken, (req, res) => {
  res.send('This is a secret area!');
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});