'use strict'
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


exports.initServer = ()=> app.listen(port, async ()=>
{
    console.log(`Server HTTP running in port ${port}.`)
});
