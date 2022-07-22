'use strict';

const roomController = require('../controllers/room.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/*----------- R U T A S -----------*/

//P Ú B L I C A S//
api.get('/testRoom', roomController.testRoom);
api.post('/getRoomByName',[mdAuth.ensureAuth],roomController.getRoomName);

//Admin Hotel//
api.get('/getRooms', roomController.getRooms);
api.get('/getRoom/:id',[mdAuth.ensureAuth, mdAuth.isAdminHotel],roomController.getRooms);
api.get('/getRoomsAvalilables',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomsAvailables);
api.get('/getRoomsNotAvalibles',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomsNotAvailables);
api.post('/saveRoom',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.saveRoom);
api.post('/updateRoom/:id',[mdAuth.ensureAuth, mdAuth.isAdminHotel],roomController.updateRoom);
api.delete('/deleteRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], roomController.deleteRoom);

//Admin//
api.get('/getRoomByHotel/:id',roomController.getRoomHotel);


module.exports = api;