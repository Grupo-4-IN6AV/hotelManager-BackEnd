'use strict';

const reservationController = require('../controllers/reservation.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testReservation', reservationController.testReservation);


//Admin Hotel//
api.post('/saveReservation', mdAuth.ensureAuth, reservationController.saveR);
api.post('/addServiceReservation/:id', mdAuth.ensureAuth, reservationController.addService);
api.delete('/deleteReservation/:id', mdAuth.ensureAuth, reservationController.deleteReservation);
api.delete('/deleteServiceReservation/:id', mdAuth.ensureAuth, reservationController.deleteService);

api.get('/getReservationsUser', mdAuth.ensureAuth, reservationController.getReservationsUser);
api.get('/getReservationsManager', mdAuth.ensureAuth, reservationController.getReservationsManager);

module.exports = api;