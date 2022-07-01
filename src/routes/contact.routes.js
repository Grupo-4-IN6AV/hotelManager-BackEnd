'use strict'

const express = require('express');
const contactController = require('../controllers/contact.controller');
const api = express.Router();

api.post('/sendMessage', contactController.sendMessage);

module.exports = api;