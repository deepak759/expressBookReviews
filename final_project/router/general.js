const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// Get the list of all books
public_users.get('/', (req, res) => {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.send({ message: "Book not found" });
    }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (filteredBooks.length > 0) {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.send({ message: "No books found by this author" });
    }
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (filteredBooks.length > 0) {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.send({ message: "No books found with this title" });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.send({ message: "Book not found" });
    }
});

module.exports.general = public_users;
