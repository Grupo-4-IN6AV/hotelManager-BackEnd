'use strict';

const eventController = require('../controllers/event.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


//----------- R U T A S -----------//

//P Ú B L I C A S//
api.get('/testEvent', eventController.testEvent);

//Admin Hotel//
api.post('/saveEvent', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.saveEvent);
api.get('/getEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.getEvent);
api.get('/getEvents', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.getEvents);
api.post('/updateEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.updateEvent);
api.delete('/deteleEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], eventController.deleteEvent);

module.exports = api;