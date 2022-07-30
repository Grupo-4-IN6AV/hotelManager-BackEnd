'use strict';

const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        address: String,
        email: String,
        phone: String,
        admin: {type: mongoose.Schema.ObjectId, ref : 'User'},
        image: String,
        visits: Number
    }
);

module.exports = mongoose.model('Hotel', hotelSchema);