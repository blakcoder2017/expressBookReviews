const axios = require('axios');

// --- Existing book list test code here ---
// (getBooksWithPromises, getBooksWithAsyncAwait)

// --- New: Get book by ISBN using Promises ---
function getBookByISBNWithPromises(isbn) {
  axios.get(`http://localhost:8000/isbn/${isbn}`)
    .then(response => {
      console.log(`Book with ISBN ${isbn} using Promises:\n`, response.data);
    })
    .catch(error => {
      console.error(`Error fetching book with ISBN ${isbn} (Promises):`, error.message);
    });
}

// --- New: Get book by ISBN using async/await ---
async function getBookByISBNWithAsyncAwait(isbn) {
  try {
    const response = await axios.get(`http://localhost:8000/isbn/${isbn}`);
    console.log(`Book with ISBN ${isbn} using Async/Await:\n`, response.data);
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn} (Async/Await):`, error.message);
  }
}

// --- Call the functions with test ISBN ---
const testISBN = '1'; // Replace with an actual ISBN from your `booksdb.js`

getBookByISBNWithPromises(testISBN);
getBookByISBNWithAsyncAwait(testISBN);
