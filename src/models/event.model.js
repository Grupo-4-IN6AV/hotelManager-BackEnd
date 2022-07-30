'use strict';

const mongoose = require('mongoose');
const eventSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        typeEvent:String,
        date: Date,
        startHour: String,
        endHour: String,
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'},
        image: String
    }
);
module.exports = mongoose.model('Event', eventSchema);
