const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const URI = process.env.CONNECTION_STRING;
const app = express();
const client = new MongoClient(URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db('redirect_db');
}
connectDB();

app.use(express.static('public')); // serve static HTML/CSS/JS from /public

// API endpoint to fetch redirect info given a custom URL
app.get('/api/go/:name', async (req, res) => {
  const name = req.params.name;
  const result = await db.collection('redirects').findOne({ name: name });
  if (result) {
    res.json({ url: result.url });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
app.listen(3000, () => console.log('Server running'));
