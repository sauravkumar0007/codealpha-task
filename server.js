const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    // Seed some products
    const products = [
        ['Laptop', 999.99],
        ['Phone', 599.99],
        ['Headphones', 99.99]
    ];
    const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
    products.forEach(product => stmt.run(product));
    stmt.finalize();
});

// API endpoints
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/orders', (req, res) => {
    const { items, total } = req.body;
    
    db.run('INSERT INTO orders (total) VALUES (?)', [total], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const orderId = this.lastID;
        const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');
        
        items.forEach(item => {
            stmt.run(orderId, item.id, 1);
        });
        
        stmt.finalize();
        res.json({ success: true, orderId });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});