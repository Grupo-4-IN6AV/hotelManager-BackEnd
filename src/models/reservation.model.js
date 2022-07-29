'use strict';

const mongoose = require('mongoose');


const reservationSchema = mongoose.Schema(
    {
        state: String,
        entryDate: Date,
        exitDate: Date,
        totalDays: Number,
        totalNights: Number,
        user: {type: mongoose.Schema.ObjectId, ref : 'User'},
        NIT: String,
        totalPersons: Number,
        room: {
                room:{type: mongoose.Schema.ObjectId, ref : 'Room'}, 
                price: Number,
            },
        services: 
        [{
                service:{type: mongoose.Schema.ObjectId, ref : 'Service'}, 
                price: Number,
        }],
        hotel: {type: mongoose.Schema.ObjectId, ref : 'Hotel'},
        IVA: Number,
        subTotal: Number,
        total: Number,
    });

module.exports = mongoose.model('Reservation', reservationSchema);