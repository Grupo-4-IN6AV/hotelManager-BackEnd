'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//FUNCIÓN PÚBLICA
api.get('/userTest', userController.userTest);

//FUNCIONES PRIVADAS//
//CLIENT//
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.delete);

//FUNCIONES PRIVADAS//
//ADMIN//
api.post('/saveUser', userController.saveUser);
api.put('/updateUser/:id',  userController.updateUser);
api.delete('/deleteUser/:id', userController.deleteUser);
api.get('/getUser/:id', userController.getUser);
api.post('/searchUser',  userController.searchUser);
api.get('/getUsers', userController.getUsers);
api.get('/getUsersByUp', userController.getUsersByUp);
api.get('/getUsersByDown', userController.getUsersByDown);
api.get('/getUsersSurnameByUp',  userController.getUsersSurnameByUp);
api.get('/getUsersSurnameByDown',  userController.getUsersSurnameByDown);
api.get('/getUsersClient', userController.getUsersClient);
api.get('/getUsersAdminHotel', userController.getUsersAdminHotel);

module.exports = api;