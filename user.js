const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ira_vida0',
  database: 'login_db'
});

db.connect((err) => {
  if (err) {
    console.log('DB connection failed:', err);
  } else {
    console.log('MySQL connected');
  }
});

// ✅ CREATE user
app.post("/users", (req, res) => {
  const { fullname, email, username, phonenumber, password, confirmation } = req.body;

  if (!fullname || !email || !username || !phonenumber || !password || !confirmation) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = 'INSERT INTO users (fullname, email, username, phonenumber, password, confirmation) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [fullname, email, username, phonenumber, password, confirmation];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to insert user' });
    }
    res.status(201).json({
      id: result.insertId,
      fullname,
      email,
      username,
      phonenumber,
      password,
      confirmation
    });
  });
});

// ✅ READ all users
app.get("/users", (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// READ one user by id
app.get("/users/:id", (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const userId = req.params.id;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// UPDATE user
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { fullname, email, username, phonenumber, password, confirmation } = req.body;

  const sql = `UPDATE users SET 
    fullname = ?, email = ?, username = ?, phonenumber = ?, password = ?, confirmation = ? 
    WHERE id = ?`;

  const values = [fullname, email, username, phonenumber, password, confirmation, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Update failed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  });
});

// ✅ DELETE user
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Delete failed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});