'use strict';

const mongoose = require('mongoose');
const typeRoomSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
        numberPersons: Number,
    }
);
module.exports = mongoose.model('TypeRoom', typeRoomSchema);