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
api.get('/getService/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.getService);
api.get('/getServices', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.getServices);
api.put('/updateService/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.updateService);
api.delete('/deleteService/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.deleteService);
api.post('/searchService', serviceController.searchService);


//ADMIN HOTEL//
api.get('/getServicesHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.getServicesHotel);
api.delete('/deleteServiceHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.deleteService);
api.post('/saveServiceHotel', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.saveService);
api.put('/updateServiceHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.updateService);
api.put('/saveIconService/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.saveIconService);
api.get('/getServiceHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdminHotel], serviceController.getService);

module.exports = api;