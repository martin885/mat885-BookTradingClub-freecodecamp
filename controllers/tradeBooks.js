const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Book = require('../models/book.js');
const Trade = require('../models/trade.js');

router.get('/', isLoggedIn, function (req, res) {
    res.render('tradeList', {
        title: 'Trade List'
    });
});

router.post('/acceptRequest/:tradeId', isLoggedIn, function (req, res) {
    var tradeId = req.params.tradeId;

    Trade.findById(tradeId).populate({


        path: 'book',
        model: 'Book'
    }).exec(function (err, trade) {
        var bookId = trade.book._id;

        Book.findById(bookId).populate({
            path: 'owner',
            model: 'User'
        }).exec(function (err, book) {
            var oldOwnerId = book.owner;
            var newOwnerId = trade.from;
            book.owner = newOwnerId;
            book.status = 'available';
            book.save(function (err) {
                if (err) {
                    return console.log(err);
                }
                User.findById(oldOwnerId).exec(function (err, user) {
                    if (err) {
                        return console.log(err);
                    }
                    var bookIndex = user.addedBooks.indexOf(bookId);

                    user.addedBooks.splice(bookIndex, 1);
                    user.save(function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        trade.remove(function (err) {
                            if (err) {
                                return console.log(err);


                            }
                            res.redirect('/allbooks');
                        });
                    });
                });
            });
        });

    });


});

router.post('/rejectRequest/:tradeId', isLoggedIn, function (req, res) {
    var tradeId = req.params.tradeId;

    Trade.findById(tradeId).populate({
        path: 'book',
        model: 'Book'
    }).exec(function (err, trade) {
        if (err) {
            return console.log(err);
        }
        var bookId = trade.book._id;
        Book.findById(bookId).exec(function (err, book) {
            book.status = "available";
            book.save(function (err) {
                if (err) {
                    return console.log(err);
                }
                trade.remove(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    res.redirect('/allbooks');
                });
            });
        });
    });
});

router.post('/cancelRequest/:tradeId', isLoggedIn, function (req, res) {
    var tradeId = req.params.tradeId;
    Trade.findById(tradeId).populate({
        path: 'book',
        model: 'Book'
    }).exec(function (err, trade) {

        if (err) {
            return console.log(err);
        }
        var bookId = trade.book._id;
        Book.findById(bookId).exec(function (err, book) {
            console.log(book);
            book.status = 'available';
            book.save(function (err) {
                if (err) {
                    return console.log(err);
                }
                trade.remove(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    res.redirect('/allbooks');
                });
            });
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}