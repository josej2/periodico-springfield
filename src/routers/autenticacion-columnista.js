
const express = require('express');
const passport = require('passport');
const rutas = express.Router();
const conexionmysql = require('../basededatos');



rutas.get("/vista-columnista", (req, res) =>
    {
        res.render('menu_columnista/menu-columnista')
    }
)

rutas.get("/crear-noticias" ,(req, res) => 
    {
        res.render('menu_columnista/crear-noticias')
    }
)


rutas.post("/crear-noticia", async(req, res)=>
    {
        const {titulo, descripcion, urlimagen} = req.body
        const nuevaNoticia = {
            titulo,
            descripcion,
            urlimagen
        };
        console.log(nuevaNoticia);
        await conexionmysql.query('INSERT INTO noticias set ?', [nuevaNoticia])
    }   
)

module.exports = rutas;