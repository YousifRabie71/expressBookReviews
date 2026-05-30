const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "Unable to register user." });
});

// Task 10: Get all books using async/await
public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const result = Object.values(books).filter(book =>
      book.author.toLowerCase().includes(author)
    );

    if (result.length > 0) {
      resolve(result);
    } else {
      reject("No books found by this author");
    }
  });

  getBooksByAuthor
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 13: Get all books based on title using Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    const result = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(title)
    );

    if (result.length > 0) {
      resolve(result);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
