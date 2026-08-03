// Load environment variables from .env file
require('dotenv').config();

//web server configuration
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', { title: 'My Web App' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});