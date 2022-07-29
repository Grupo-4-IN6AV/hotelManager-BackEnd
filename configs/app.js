'use strict'

//Importación de Encriptado//
const {encrypt} = require('../src/utils/validate');

//Importación del Modelo de Usuario//
const User = require('../src/models/user.model');

//Importación de las Rutas//
const userRoutes = require('../src/routes/user.routes');
const hotelRoutes = require('../src/routes/hotel.routes');
const serviceRoutes = require('../src/routes/service.routes');
const eventRoutes = require('../src/routes/event.routes');
const contactRoutes = require('../src/routes/contact.routes')
const typeRoomRoutes = require('../src/routes/typeRoom.routes')
const roomRoutes = require('../src/routes/room.routes')

/*Connect MultiParty*/
const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const port = 3200 || process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet({}));
app.use(cors());


//USO DE RUTAS//
app.use('/user', userRoutes);
app.use('/hotel', hotelRoutes);
app.use('/service', serviceRoutes);
app.use('/event', eventRoutes);
app.use('/contact', contactRoutes);
app.use('/typeRoom', typeRoomRoutes);
app.use('/room', roomRoutes);


exports.initServer = ()=> app.listen(port, async ()=>
{
    console.log(`Server HTTP running in port ${port}.`)
    const automaticUser = 
    {
        username: 'SuperAdmin',
        name: 'SuperAdmin',
        surname: 'SuperAdmin',
        phone: 'SuperAdmin',
        email: 'admin@kinal.edu.gt',
        password: await encrypt('hotel123'),
        role: 'ADMIN'
    }
    const searchUserAdmin = await User.findOne({username:automaticUser.username});
    if(!searchUserAdmin)
    {
        let userAdmin = new User(automaticUser);
        await userAdmin.save();
        console.log('User SuperAdmin register Successfully.')
    }

    //CREACION DE LA CARPETA POR ÚNICA VEZ//
    fs.mkdir(path.join(__dirname, '../uploads/users'),
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });

    fs.mkdir(path.join(__dirname, '../uploads/rooms'),
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });

    fs.mkdir(path.join(__dirname, '../uploads/events'),
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });

    fs.mkdir(path.join(__dirname, '../uploads/rooms'),
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });

    fs.mkdir(path.join(__dirname, '../uploads/hotels'),
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });
});
