const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const products = await db.all('SELECT * FROM products ORDER BY id ASC');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

module.exports = router;
