const express = require('express');
const cors = require('cors');
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

app.use(cors());
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

module.exports = app;
