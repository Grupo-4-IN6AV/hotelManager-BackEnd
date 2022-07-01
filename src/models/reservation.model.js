'use strict';

const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema
(
    {
        entryDate: Date,
        exitDate: Date,
        price: Number,
        services: [{serviceId: {type: mongoose.Schema.ObjectId, ref : 'Service'}}],
        rooms: [{room:{type: mongoose.Schema.ObjectId, ref : 'Room'}}],
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'},
        user: {type: mongoose.Schema.ObjectId, ref : 'User'},
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);