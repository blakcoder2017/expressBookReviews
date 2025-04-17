const axios = require('axios');

// Using Promises
function getBooksWithPromises() {
  axios.get('http://localhost:8000/')
    .then(response => {
      console.log("Books using Promises:\n", response.data);
    })
    .catch(error => {
      console.error("Error fetching books (Promises):", error.message);
    });
}

// Using async/await
async function getBooksWithAsyncAwait() {
  try {
    const response = await axios.get('http://localhost:8000/');
    console.log("Books using Async/Await:\n", response.data);
  } catch (error) {
    console.error("Error fetching books (Async/Await):", error.message);
  }
}

// Call the functions
getBooksWithPromises();
getBooksWithAsyncAwait();