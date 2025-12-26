const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send({ message: "Username and password are required" });
        }

        if (!isValid(username)) {
            return res.send({ message: "Username already exists" });
        }

        users.push({ username, password });
        return res.send({ message: "User successfully registered" });

    } catch (error) {
        return res.send({ message: "Registration failed" });
    }
});

// Get the list of all books
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await Promise.resolve(books);
        return res.send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.send({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await Promise.resolve(books[isbn]);

        if (book) {
            return res.send(JSON.stringify(book, null, 4));
        } else {
            return res.send({ message: "Book not found" });
        }
    } catch (error) {
        return res.send({ message: "Error retrieving book" });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const filteredBooks = await Promise.resolve(
            Object.values(books).filter(
                book => book.author.toLowerCase() === author
            )
        );

        if (filteredBooks.length > 0) {
            return res.send(JSON.stringify(filteredBooks, null, 4));
        } else {
            return res.send({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.send({ message: "Error retrieving books by author" });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const filteredBooks = await Promise.resolve(
            Object.values(books).filter(
                book => book.title.toLowerCase() === title
            )
        );

        if (filteredBooks.length > 0) {
            return res.send(JSON.stringify(filteredBooks, null, 4));
        } else {
            return res.send({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.send({ message: "Error retrieving books by title" });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const reviews = await Promise.resolve(books[isbn]?.reviews);

        if (reviews !== undefined) {
            return res.send(JSON.stringify(reviews, null, 4));
        } else {
            return res.send({ message: "Book not found" });
        }
    } catch (error) {
        return res.send({ message: "Error retrieving reviews" });
    }
});

module.exports.general = public_users;
