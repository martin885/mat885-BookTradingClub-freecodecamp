const mongoose = require('mongoose');

const User = require('./user.js');
const Book = require('./book.js');
const Schema = mongoose.Schema;
const TradeSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: Schema.Types.ObjectId,


        ref: 'Book'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const Trade = mongoose.model('trade', TradeSchema);
module.exports = Trade;