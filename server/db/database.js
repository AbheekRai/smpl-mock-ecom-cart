const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mock_ecom.db');

async function init() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  // Create tables if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      stock_quantity INTEGER DEFAULT 100,
      category TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL DEFAULT 1,
      user_id TEXT DEFAULT 'default',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed products if table empty
  const row = await db.get('SELECT COUNT(1) as cnt FROM products');
  if (row && row.cnt === 0) {
    const seed = [
      ['Classic T-Shirt','Comfort cotton t-shirt',19.99,'https://via.placeholder.com/300x200?text=T-Shirt',50,'apparel'],
      ['Running Shoes','Lightweight running shoes',59.99,'https://via.placeholder.com/300x200?text=Shoes',30,'footwear'],
      ['Coffee Mug','Ceramic mug 350ml',9.99,'https://via.placeholder.com/300x200?text=Mug',100,'home'],
      ['Wireless Mouse','Ergonomic mouse',29.5,'https://via.placeholder.com/300x200?text=Mouse',20,'electronics'],
      ['Notebook','200 page notebook',4.99,'https://via.placeholder.com/300x200?text=Notebook',200,'stationery']
    ];
    const stmt = await db.prepare('INSERT INTO products (name,description,price,image,stock_quantity,category) VALUES (?,?,?,?,?,?)');
    for (const p of seed) {
      await stmt.run(...p);
    }
    await stmt.finalize();
    console.log('Seeded products');
  }

  module.exports.db = db;
  return db;
}

module.exports = { init, getDb: () => module.exports.db };
