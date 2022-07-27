'use strict';

const roomController = require('../controllers/room.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


//CARGAR IMAGENES/
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir:'./uploads/rooms'});

/*----------- R U T A S -----------*/


//P Ú B L I C A S//
api.get('/testRoom', roomController.testRoom);
api.post('/searchRoom',roomController.getRoomName);

//Admin Hotel//
api.get('/getRooms', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.getRooms);
api.get('/getRoom/:id', roomController.getRoom);
api.get('/getRoomsAvalilables',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomsAvailables);
api.get('/getRoomsNotAvalibles',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.getRoomsNotAvailables);
api.post('/saveRoom', [mdAuth.ensureAuth, mdAuth.isAdmin],roomController.saveRoom);
api.put('/updateRoom/:id',[mdAuth.ensureAuth, mdAuth.isAdmin],roomController.updateRoom);
api.delete('/deleteRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.deleteRoom);

//ADMIN HOTEL//
api.post('/saveRoomHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel],roomController.saveRoom);
api.get('/getRoomsHotelAdmin', [mdAuth.ensureAuth, mdAuth.isAdminHotel], roomController.getRoomHotelAdmin);
api.get('/getRoomByHotel/:id',roomController.getRoomHotel);
api.put('/updateRoomHotel/:id',[mdAuth.ensureAuth, mdAuth.isAdminHotel],roomController.updateRoom);
api.delete('/deleteRoomHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], roomController.deleteRoom);

//IMAGENES//
api.post('/uploadImageRoom/:id', [mdAuth.ensureAuth, upload], roomController.addImageRoom);
api.get('/getImageRoom/:fileName',  upload, roomController.getImageRoom);

module.exports = api;