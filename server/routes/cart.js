const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

const USER = 'default';

// Get cart
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const items = await db.all(`
      SELECT cart.id as id, cart.qty as qty, p.id as product_id, p.name, p.price, p.image, p.stock_quantity
      FROM cart JOIN products p ON cart.product_id = p.id
      WHERE cart.user_id = ?
    `, [USER]);
    const total = items.reduce((s, it) => s + (it.price * it.qty), 0);
    res.json({ items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching cart' });
  }
});

// Add / update item
router.post('/', async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const db = getDb();
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock_quantity === 0) return res.status(400).json({ error: 'Out of stock' });

    const existing = await db.get('SELECT * FROM cart WHERE product_id = ? AND user_id = ?', [productId, USER]);
    if (existing) {
      const newQty = Math.min(existing.qty + qty, product.stock_quantity);
      await db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, existing.id]);
      const item = await db.get('SELECT cart.id as id, cart.qty as qty, p.* FROM cart JOIN products p ON cart.product_id=p.id WHERE cart.id=?', [existing.id]);
      return res.json(item);
    } else {
      const result = await db.run('INSERT INTO cart (product_id, qty, user_id) VALUES (?,?,?)', [productId, Math.min(qty, product.stock_quantity), USER]);
      const id = result.lastID;
      const item = await db.get('SELECT cart.id as id, cart.qty as qty, p.* FROM cart JOIN products p ON cart.product_id=p.id WHERE cart.id=?', [id]);
      return res.json(item);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding to cart' });
  }
});

// Update qty
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    if (!qty || qty < 1) return res.status(400).json({ error: 'qty must be >= 1' });
    const db = getDb();
    const item = await db.get('SELECT cart.id as id, cart.qty as qty, p.stock_quantity FROM cart JOIN products p ON cart.product_id=p.id WHERE cart.id=?', [id]);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    const newQty = Math.min(qty, item.stock_quantity);
    await db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, id]);
    const updated = await db.get('SELECT cart.id as id, cart.qty as qty, p.* FROM cart JOIN products p ON cart.product_id=p.id WHERE cart.id=?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating cart' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const del = await db.run('DELETE FROM cart WHERE id=?', [id]);
    if (del.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing cart item' });
  }
});

module.exports = router;
