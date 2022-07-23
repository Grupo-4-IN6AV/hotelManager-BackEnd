'use strict';

const roomController = require('../controllers/room.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

/*----------- R U T A S -----------*/


//P Ú B L I C A S//
api.get('/testRoom', roomController.testRoom);
api.post('/searchRoom',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomName);

//Admin Hotel//
api.get('/getRooms', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.getRooms);
api.get('/getRoom/:id', roomController.getRoom);
api.get('/getRoomsAvalilables',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomsAvailables);
api.get('/getRoomsNotAvalibles',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomsNotAvailables);
api.post('/saveRoom', [mdAuth.ensureAuth, mdAuth.isAdmin],roomController.saveRoom);
api.put('/updateRoom/:id',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.updateRoom);
api.delete('/deleteRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.deleteRoom);

//Admin//
api.get('/getRoomByHotel/:id',roomController.getRoomHotel);


module.exports = api;