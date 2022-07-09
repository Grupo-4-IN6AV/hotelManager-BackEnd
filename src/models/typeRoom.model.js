'use strict';

const mongoose = require('mongoose');
const typeRoomSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        numberPersons: Number,
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'},
    }
);
module.exports = mongoose.model('TypeRoom', typeRoomSchema);