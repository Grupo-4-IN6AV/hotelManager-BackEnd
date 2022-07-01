'use strict';

const mongoose = require('mongoose');
const typeEventSchema = mongoose.Schema
(
    {
        name: String,
        description: String,
    }
);
module.exports = mongoose.model('TypeEvent', typeEventSchema);