'use strict'

//Importación de Encriptado//
const {encrypt} = require('../src/utils/validate');

//Importación del Modelo de Usuario//
const User = require('../src/models/user.model');

//Importación de las Rutas//
const userRoutes = require('../src/routes/user.routes');
const hotelRoutes = require('../src/routes/hotel.routes');
const serviceRoutes = require('../src/routes/service.routes');

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
});
