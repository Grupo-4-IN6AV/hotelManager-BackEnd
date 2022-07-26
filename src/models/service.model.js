'use strict';

const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        price: Number,
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'},
        icon: String
    }
);
module.exports = mongoose.model('Service', serviceSchema);