// server.js

const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing application/json
app.use(express.json());

// Define a simple route to fetch notes
app.get('/notes', (req, res) => {
  res.json([{ id: 1, content: "Hello World" }]);
});

// Start the server on a specified port
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
