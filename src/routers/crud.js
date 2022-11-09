const express = require('express');
const rutas = express.Router();
const conexionmysql = require('../basededatos')
const {noestalogeado} = require('../lib/validador-login')

rutas.get('/vista-admin', noestalogeado, (req, res ) => 
    {
        res.render('menu_admin/menu');
    }
)



module.exports = rutas;

  
