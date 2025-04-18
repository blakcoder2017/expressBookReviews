const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bcrypt = require('bcrypt');

public_users.post("/register", async (req,res) => {
  const { username, email, password } = req.body;

  // Validate the input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields (username, email, password) are required" });
  }

  // Check if the user already exists
  if (users[email]) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in the in-memory object (in real use, save to database)
    users[email] = { username, email, password: hashedPassword };

    // Send success response
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {

//   res.status(200).send(JSON.stringify(books, null, 2));
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;

  if (!isbn || typeof isbn !== 'string') {
    return res.status(400).json({ message: "Invalid or missing ISBN" });
  }

  // Check if the book exists in the object using isbn as the key
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

  
 });

 public_users.get ('/', async function getBooksWithAsyncAwait(req,res) {
  try {
    const response = await axios.get('http://localhost:8000/');  // Fetch books from the other server
    const result = {
      message: "Books using Async/Await:\n",
      books: response.data
    };
    res.status(200).json(result);  // Send the JSON response
    console.log("Books using Async/Await:\n", response.data);  // Log the books
  } catch (error) {
    console.error("Error fetching books (Async/Await):", error.message);
    res.status(500).json({ message: "Error fetching books" });  // Respond with an error message if fetching fails
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function getBooksByAuthor(req, res) {
  const { author } = req.params;

  // Validate the input to ensure author is a string and exists
  if (!author || typeof author !== 'string') {
    return res.status(400).json({ message: "Invalid or missing author name" });
  }

  try {
    // Filter the books by author from the local books data
    const booksByAuthor = Object.values(books).filter((book) =>
      book.author.toLowerCase() === author.toLowerCase()
    );

    // If books are found for the author, send the response
    if (booksByAuthor.length > 0) {
      console.log("Books by Author Async-awaits:", booksByAuthor);
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error fetching books by author:", error.message);
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function getBooksByTitle(req, res) {
  const { title } = req.params;

  // Validate the input to ensure title is a string and exists
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Invalid or missing title" });
  }

  try {
    // Filter the books by title from the local books data
    const booksByTitle = Object.values(books).filter((book) =>
      book.title.toLowerCase() === title.toLowerCase()
    );

    // If books are found for the title, send the response
    if (booksByTitle.length > 0) {
      console.log("Books by Title Async-await:", booksByTitle);
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error fetching books by title:", error.message);
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;

  // Check if isbn is provided and is a string
  if (!isbn || typeof isbn !== 'string') {
    return res.status(400).json({ message: "Invalid or missing ISBN" });
  }

  // Check if the book exists with the provided ISBN
  const book = books[isbn];

  if (book) {
    // Assuming book.reviews is an array that holds reviews for that book
    if (book.reviews && book.reviews.length > 0) {
      return res.status(200).json({ reviews: book.reviews });
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
