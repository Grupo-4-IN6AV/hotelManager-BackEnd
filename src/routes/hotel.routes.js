'use strict';

const hotelController = require('../controllers/hotel.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testHotel', hotelController.testHotel);


//Admin Hotel//
api.post('/saveHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], hotelController.saveHotel);
api.get('/getHotel/:id', hotelController.getHotel);
api.get('/getHotels',  hotelController.getHotels);
api.post('/getHotelName',  hotelController.getHotelName);
api.get('/getHotelsNameUp',  hotelController.getHotelsNameUp);
api.get('/getHotelsNameDown',  hotelController.getHotelsNameDown);
api.put('/updateHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], hotelController.updateHotel);
api.delete('/deleteHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], hotelController.deleteHotel);


module.exports = api;