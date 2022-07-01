'use strict';

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        price:Number,
        dateAvailable: Date,
        state: Boolean,      
        typeRoom: {type: mongoose.Schema.ObjectId, ref : 'TypeRoom'},
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'}
    }
);

module.exports = mongoose.model('Room', roomSchema);