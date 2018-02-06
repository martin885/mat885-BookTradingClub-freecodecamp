const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Book = require('../models/book');
const Trade=require('../models/trade');
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


router.post('/profile/removeBook/:bookId', isLoggedIn, function (req, res) {
    var bookId = req.params.bookId;
    User.findById(req.user._id, function (err, user) {
        if (err) {
            return console.log(err);
        }
        var bookIndex = user.addedBooks.indexOf(bookId);
        user.addedBooks.splice(bookIndex, 1);
        user.save(function (err) {
            if (err) {
                return console.log(err);
            }
            Book.findByIdAndRemove(bookId, function (err, book) {
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
                user: req.user
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

router.post('/profile/trade/:bookId', isLoggedIn, function (req, res) {
    var bookId = req.params.bookId;
    var currentUser = req.user._id;
    Book.findById(bookId)
    populate({ path: 'owner', model: 'User' }).
        exec(function (err, book) {
            var bookOwner = book.owner._id;
            if (currentUser.equals(bookOwner)) {
                req.flash('tradeMessage', 'You are the owner of this book');
                res.redirect('/allbooks');
            }else{
                Trade.findOne({
                    from:currentUSer,
                    to:bookOwner,
                    book:book._id,
                    status:'pending'
                },function(err,trade){
                    if(err){
                       return console.log(err);
                    }
                    if(trade){
                        consolle.log('The request is already done');
                        req.flash('tradeMessage','You alredy do this request to the owner');
                        res.redirect('/allbooks');
                    }else{
                        var newTrade=new Trade();
                        newTrade.from=currentUser;
                        newTrade.to=bookOwner;
                        newTrade.book=book;

                        newTrade.save(function(err){
                            if(err){
                                return console.log(err);
                            }
                            book.status='pending';
                            req.flash('tradeMessage','Request done ok');
                            res.redirect('/allbooks');
                        });
                    }
                });
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