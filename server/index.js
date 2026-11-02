const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ─── In-memory "database" ────────────────────────────────────────────────────
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith',    email: 'bob@example.com',   role: 'user'  },
  { id: 3, name: 'Carol White',  email: 'carol@example.com', role: 'user'  },
];
let nextId = 4;

// ─── Health Check ─────────────────────────────────────────────────────────────
// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── Users CRUD ───────────────────────────────────────────────────────────────

// GET /api/users  — list all users
app.get('/api/users', (req, res) => {
  res.json({ success: true, count: users.length, data: users });
});

// GET /api/users/:id  — get single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: `User with id ${req.params.id} not found` });
  }
  res.json({ success: true, data: user });
});

// POST /api/users  — create new user
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'name and email are required' });
  }

  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  const newUser = { id: nextId++, name, email, role: role || 'user' };
  users.push(newUser);

  res.status(201).json({ success: true, message: 'User created', data: newUser });
});

// PUT /api/users/:id  — update user (full replace)
app.put('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: `User with id ${req.params.id} not found` });
  }

  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'name and email are required' });
  }

  users[idx] = { ...users[idx], name, email, role: role || users[idx].role };
  res.json({ success: true, message: 'User updated', data: users[idx] });
});

// PATCH /api/users/:id  — partial update
app.patch('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: `User with id ${req.params.id} not found` });
  }

  users[idx] = { ...users[idx], ...req.body };
  res.json({ success: true, message: 'User partially updated', data: users[idx] });
});

// DELETE /api/users/:id  — delete user
app.delete('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: `User with id ${req.params.id} not found` });
  }

  const deleted = users.splice(idx, 1)[0];
  res.json({ success: true, message: 'User deleted', data: deleted });
});

// ─── Products CRUD ────────────────────────────────────────────────────────────
let products = [
  { id: 1, name: 'Laptop',    price: 999.99,  category: 'Electronics', stock: 10 },
  { id: 2, name: 'Headphones',price: 149.99,  category: 'Electronics', stock: 25 },
  { id: 3, name: 'Notebook',  price: 4.99,    category: 'Stationery',  stock: 100 },
];
let nextProductId = 4;

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;
  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: `Product with id ${req.params.id} not found` });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'name and price are required' });
  }
  const product = { id: nextProductId++, name, price: parseFloat(price), category: category || 'General', stock: stock ?? 0 };
  products.push(product);
  res.status(201).json({ success: true, message: 'Product created', data: product });
});

app.put('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  const { name, price, category, stock } = req.body;
  products[idx] = { ...products[idx], name, price: parseFloat(price), category, stock };
  res.json({ success: true, message: 'Product updated', data: products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  const deleted = products.splice(idx, 1)[0];
  res.json({ success: true, message: 'Product deleted', data: deleted });
});

// ─── Echo / Test utilities ────────────────────────────────────────────────────

// POST /api/echo  — mirrors back your request body
app.post('/api/echo', (req, res) => {
  res.json({
    success: true,
    message: 'Echo response',
    received: {
      body: req.body,
      headers: req.headers,
      query: req.query,
    },
  });
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`\n🚀  API Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET     /api/health`);
  console.log(`  GET     /api/users`);
  console.log(`  GET     /api/users/:id`);
  console.log(`  POST    /api/users`);
  console.log(`  PUT     /api/users/:id`);
  console.log(`  PATCH   /api/users/:id`);
  console.log(`  DELETE  /api/users/:id`);
  console.log(`  GET     /api/products`);
  console.log(`  GET     /api/products/:id`);
  console.log(`  POST    /api/products`);
  console.log(`  PUT     /api/products/:id`);
  console.log(`  DELETE  /api/products/:id`);
  console.log(`  POST    /api/echo\n`);
});
