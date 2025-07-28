const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('[✔] Successfully connected to MongoDB');
})
.catch((error) => {
  console.error('[✖] MongoDB connection failed:', error.message);
  process.exit(1); // Optional: Exit app on DB failure
});

// Register routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[🚀] Server is up and running on http://localhost:${PORT}`);
});
