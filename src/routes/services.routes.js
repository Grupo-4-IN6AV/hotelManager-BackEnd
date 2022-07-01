'use strict';

const serviceController = require('../controllers/service.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');


/----------- R U T A S -----------/

//P Ú B L I C A S//
api.get('/testService', serviceController.testService);


//Admin Hotel//
api.post('/saveService', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.saveService);
api.get('/getService/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.getService);
api.get('/getServices', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.getServices);
api.post('/updateService/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.updateService);
api.delete('/deleteService/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.deleteService);


module.exports = api;