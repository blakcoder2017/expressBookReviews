const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
let books = require("./booksdb.js");
const regd_users = express.Router();

const secretKey = "yourSecretKey";
let users = [];

(async () => {
  const hashedPassword1 = await bcrypt.hash("securePassword123", 10);
  const hashedPassword2 = await bcrypt.hash("mypassword", 10);

  users = [
    { username: "asherifdeen", password: hashedPassword1 },
    { username: "jane_smith", password: hashedPassword2 }
  ];

  console.log("Users preloaded");
})();
const JWT_SECRET = 'your_jwt_secret55gghh_key';
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", async (req,res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username }, secretKey, {
    expiresIn: "1h"
  });

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review; // review passed in query
  const username = req.user.username; // username from verified JWT

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review query is required" });
  }

  // Add or modify the user's review for the ISBN
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added or updated successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
