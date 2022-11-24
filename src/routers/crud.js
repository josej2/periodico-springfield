const express = require('express');
const rutas = express.Router();
const conexionmysql = require('../basededatos')
const {verificarperfil} = require('../lib/generadoresToken');

rutas.get('/vista-admin', verificarperfil,  (req, res ) => 
    {
        res.render('menu_admin/menu');

        console.log( req.cookies);
    }
)



module.exports = rutas;
//validarToken,
  
//estalogeado,