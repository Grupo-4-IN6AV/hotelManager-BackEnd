'use strict';

const typeEventController = require('../controllers/typeEvent.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testTypeEvent', typeEventController.testTypeEvent);


//Admin Hotel//
api.post('/createTypeEvent', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeEventController.saveTypeEvent);
api.get('/getTypeEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeEventController.getTypeEvent);
api.get('/getTypeEvents', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeEventController.getTypeEvents);
api.post('/updateTypeEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeEventController.updateTypeEvent);
api.delete('/deleteTypeEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], typeEventController.deleteTypeEvent);


module.exports = api;