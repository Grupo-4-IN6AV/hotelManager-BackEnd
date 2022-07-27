'use strict';

const typeRoomController = require('../controllers/typeRoom.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testTypeRoom', typeRoomController.testTypeRoom);


//Admin Hotel  CAMBIO DE RUTAS A IS ADMIN PARA PRUEBAS//
api.post('/saveTypeRoom', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.saveTypeRoom);
api.get('/getTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.getTypeRoom);
api.get('/getTypesRoomsHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.getTypeRoomsHotels);
api.put('/updateTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.updateTypeRoom);
api.delete('/deleteTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.deleteTypeRoom);
api.get('/getTypesRooms', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.getMasterTypesRooms);
api.post('/searchTypeRooms', typeRoomController.searchTypesRooms);

//ADMIN HOTEL//
api.get('/getTypeRoomHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.getTypeRoomHotel);
api.post('/saveTypeRoomHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.saveTypeRoom);
api.get('/getTypeRoomHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.getTypeRoom);
api.put('/updateTypeRoomHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.updateTypeRoom);
api.delete('/deleteTypeRoomHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.deleteTypeRoom);
api.get('/getTypeRoomHotelAdd/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.getTypeRoomsHotels);

module.exports = api;