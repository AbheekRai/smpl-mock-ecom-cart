const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

const USER = 'default';

router.post('/', async (req, res) => {
  try {
    const { name, email, cartItems } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const db = getDb();

    let items = [];
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      // cartItems: [{ productId, qty }]
      const ids = cartItems.map(c => c.productId);
      const products = await db.all(`SELECT * FROM products WHERE id IN (${ids.map(()=>'?').join(',')})`, ids);
      items = cartItems.map(c => {
        const p = products.find(x => x.id === c.productId);
        return { product: p, qty: c.qty };
      });
    } else {
      // use stored cart
      const rows = await db.all(`
        SELECT cart.id as id, cart.qty as qty, p.id as product_id, p.name, p.price
        FROM cart JOIN products p ON cart.product_id = p.id
        WHERE cart.user_id = ?
      `, [USER]);
      items = rows.map(r => ({ product: { id: r.product_id, name: r.name, price: r.price }, qty: r.qty }));
    }

    const total = items.reduce((s, it) => s + (it.product.price * it.qty), 0);
    const receipt = {
      id: 'r_' + Date.now(),
      name, email, items: items.map(it => ({ id: it.product.id, name: it.product.name, qty: it.qty, price: it.product.price })),
      total, timestamp: new Date().toISOString()
    };

    // clear cart
    await db.run('DELETE FROM cart WHERE user_id = ?', [USER]);

   res.json({ success: true, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during checkout' });
  }
});

module.exports = router;
