
const express = require('express');
const passport = require('passport');
const rutas = express.Router();
const conexionmysql = require('../basededatos');
const {validarToken, validarseccion} = require('../lib/generadoresToken')
require('dotenv').config();



rutas.get("/vista-columnista",validarseccion ,(req, res) =>
    {
        res.render('menu_columnista/menu-columnista')
    }
)

rutas.get("/crear-noticias" ,validarseccion,(req, res) => 
    {
        res.render('menu_columnista/crear-noticias')
    }
)


rutas.post("/crear-noticia",validarseccion, async(req, res)=>
    {
      const dato = await validarToken(req, res).then(token => token);
      const id_columnista = dato.id;
      const rol = dato.rol;
        const {titulo, descripcion, linkimagen} = req.body
        const nuevaNoticia = {
            id_columnista,
            rol,
            titulo,
            descripcion,
            linkimagen
        };
        console.log(nuevaNoticia);

        try{
            await conexionmysql.query('INSERT INTO noticias set ?', [nuevaNoticia])
            res.send("Noticia Creada")
        }catch(error ){
            res.send(error)
        }
    }   
)

//validarseccion

rutas.get("/ver-noticias", async (req, res) => 
    {
        const noticias = await conexionmysql.query("select * from  noticias");
        res.render('Noticias/noticias', {noticias});
    }
)

module.exports = rutas;