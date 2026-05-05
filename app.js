const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


app.post('/signup', (req, res) => {
  const { fullname, email, username, phonenumer, password, confirmation } = req.body;

  const query = 'INSERT INTO users ( fullname, email, username, phonenumber, password, confirmation) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [fullname, email, username,  phonenumer, password, confirmation], (err, result) => {
    if (err) {
      console.log(err);
      return res.send('Error while creating user');
    }

    res.send('User registered successfully');
  });
});