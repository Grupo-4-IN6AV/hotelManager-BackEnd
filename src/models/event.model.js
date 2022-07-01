'use strict';

const mongoose = require('mongoose');
const eventSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        date: Date,
        typeEvent: {type: mongoose.Schema.ObjectId, ref : 'TypeEvent'},
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'},
    }
);
module.exports = mongoose.model('Event', eventSchema);
