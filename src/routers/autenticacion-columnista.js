
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
            res.redirect('ver-noticias')
        }catch(error ){
            res.send(error)
        }
    }   
)


rutas.get("/eliminar-noticia", validarseccion, (req, res)=>
    {

        res.render('menu_columnista/eliminar-noticia')
    }
)


rutas.post("/eliminar-noticia", validarseccion, async (req, res)=>
    {
        
        const dato = await validarToken(req, res).then(token => token);

        const {idbusqueda} = req.body

        const id = parseInt(idbusqueda)
        console.log(idbusqueda);

        if(dato.rol=="admin"){
            try{
                const noticia = await conexionmysql.query('Select id, titulo, descripcion, linkimagen from noticias where id ='+id)
                  
                let titulo=""
                let descripcion=""
                let linkimagen=""
                let idnoticia=""
                

                if(noticia){

                    const objeto = noticia.map(elemento => {
                        //const objeto = [elemento.titulo, elemento.descripcion ]

                        titulo=elemento.titulo
                        descripcion = elemento.descripcion
                        linkimagen = elemento.linkimagen
                        idnoticia=elemento.id
                        return  {titulo:elemento.titulo}
                    })

                    console.log(titulo);

                    res.render('menu_columnista/eliminar-noticia', {titulo, descripcion, linkimagen, idnoticia})
                }
                else{
                    res.send("No hay registro")
                }
                
            }catch(error ){
                res.send(error)
            }
        }
        else if(dato.rol=="columnista"){
           res.send("aun no puedes eliminar noticias")
        }
    } 
)



rutas.post('/eliminacion-total', validarseccion, async (req,res)=>
    {
        const dato = await validarToken(req, res).then(token => token);
        const {id}  = req.body


        if(dato.rol=="admin"){
            try{
                    await conexionmysql.query('delete from noticias where id ='+id)
                    res.redirect('ver-noticias')
                
            }catch(error ){
                res.send(error)
            }
        }
        else if(dato.rol=="columnista"){
            res.send("aun no puede eliminar noticias")
        }
    }
)


rutas.get("/editar-noticias", validarseccion, (req, res)=>
    {

        res.render
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