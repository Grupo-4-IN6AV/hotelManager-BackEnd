'use strict';

const eventController = require('../controllers/event.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//CARGAR IMAGENES/
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir:'./uploads/events'});

//----------- R U T A S -----------//

//P Ú B L I C A S//
api.get('/testEvent', eventController.testEvent);

//ADMIN//
api.post('/saveEvent', [mdAuth.ensureAuth, mdAuth.isAdmin], eventController.saveEvent);
api.get('/getEvent/:id',  eventController.getEvent);
api.get('/getEvents', eventController.getEvents);
api.post('/getEventsName', eventController.searchEvents);
api.post('/updateEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.updateEvent);
api.delete('/deleteEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], eventController.deleteEvent);

//ADMIN HOTEL//
api.post('/saveEventHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.saveEvent);
api.get('/getEventsHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.getEventsHotel);
api.delete('/deleteEventHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.deleteEvent);


//IMAGENES//
api.post('/uploadImageEvent/:id', [mdAuth.ensureAuth, upload], eventController.addImageEvent);
api.get('/getImageEvent/:fileName',  upload, eventController.getImageEvent);

module.exports = api;