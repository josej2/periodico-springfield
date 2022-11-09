
const { Router } = require('express');
const express = require('express');
const rutas = express.Router();

rutas.get('/' , (req, res) => 
    {
        res.send("Hola springfield")
    }
)


module.exports = rutas;