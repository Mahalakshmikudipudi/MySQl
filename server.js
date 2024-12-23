const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password here
    database: 'productdb', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Get all products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching products');
        } else {
            res.json(results);
        }
    });
});

// Add a new product
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;
    const query = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
    db.query(query, [name, price, description], (err, result) => {
        if (err) {
            res.status(500).send('Error adding product');
        } else {
            res.status(201).send('Product added');
        }
    });
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
    db.query(query, [name, price, description, id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating product');
        } else {
            res.send('Product updated');
        }
    });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting product');
        } else {
            res.send('Product deleted');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
