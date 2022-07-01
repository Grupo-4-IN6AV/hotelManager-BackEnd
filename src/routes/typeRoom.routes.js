'use strict';

const typeRoomController = require('../controllers/typeRoom.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testTypeRoom', typeRoomController.testTypeRoom);


//Admin Hotel//
api.post('/createTypeRoom', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.saveTypeRoom);
api.get('/getTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.getTypeRoom);
api.get('/getTypeRoom', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.getTypeRooms);
api.post('/updateTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.updateTypeRoom);
api.delete('/deleteTypeRoom/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeRoomController.deleteTypeRoom);


module.exports = api;