// Load environment variables from .env file
require('dotenv').config();
require('./models/schema'); // Ensure the schema is loaded
//web server configuration
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./models/schema'); // Import the connectDB function
const app = express();
const port = process.env.PORT || 3000;

const dbUri = process.env.MONGODB_URI;

app.set('view engine', 'pug');

connectDB(dbUri);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// --- Global Middleware for Navigation ---
// app.use((req, res, next) => {
//   // Makes activePath & menu automatically available in every Pug template
//   // res.locals.activePath = req.path;
//   // res.locals.menu = [
//   //   { label: 'Home', url: '/' },
//   //   { label: 'Men', url: '/men' },
//   //   { label: 'Women', url: '/women' },
//   //   { label: 'Kids', url: '/kids' },
//   //   { label: 'About', url: '/about' },
//   //   { label: 'Contact', url: '/contact' }
//   // ];
//   // next();
// });

//Mount the routes at the root path
const camelRoadRoutes = require('./routes/camel-road');
app.use('/', camelRoadRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});