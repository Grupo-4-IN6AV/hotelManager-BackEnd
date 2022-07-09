'use strict';

const typeRoomController = require('../controllers/typeRoom.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testTypeRoom', typeRoomController.testTypeRoom);


//Admin Hotel  CAMBIO DE RUTAS A IS ADMIN PARA PRUEBAS//
api.post('/createTypeRoom', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.saveTypeRoom);
api.get('/getTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.getTypeRoom);
api.get('/getTypeRooms/:idHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.getTypeRooms);
api.put('/updateTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.updateTypeRoom);
api.delete('/deleteTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], typeRoomController.deleteTypeRoom);


module.exports = api;