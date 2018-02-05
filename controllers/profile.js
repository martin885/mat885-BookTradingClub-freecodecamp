const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Book = require('../models/book');
const books = require('google-books-search');







router.post('/profile/addBook', isLoggedIn, function (req, res) {
    var newBook = new Book();




    newBook.id = req.body.id;
    newBook.title = req.body.title;
    newBook.authors = req.body.authors;
    newBook.publisher = req.body.publisher;
    newBook.description = req.body.description;
    newBook.link = req.body.link;
    newBook.imageUrl = req.body.imageUrl;
    newBook.owner = req.user._id;

    newBook.save(function (err) {
        if (err) {
            return console.log(err);
        }
        User.findById(req.user._id, function (err, user) {
            if (err) {
                return console.log(err);
            }
            user.addedBooks.push(newBook);
            user.save(function (err) {
                if (err) {
                    return console.log(err);
                }
                res.redirect('/profile');
            });
        });
    });

});




router.get('/profile', isLoggedIn, function (req, res) {
    Book.find({ owner: req.user._id }, function (err, books) {
        if (err) {
            return console.log(err);
        }
        else {
            res.render('profile', {
                title: 'profile page',
                books: books,
                user:req.user
            });
        }
    });
});

router.get('/search', function (req, res) {
    var title = req.query.title;

    books.search(title, function (err, results, apiResponse) {
        if (!err) {
            res.render('search', {
                title: `search page`,
                books: results
            });
        }
        else {
            console.log(err);
            res.status(404).send('File Not Found');
        }
    });
});






module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}