
const express = require('express');
const rutas = express.Router();
const passport = require('passport');
const { render } = require('timeago.js');
const {noestalogeado, estalogeado} = require('../lib/validador-login');
const {body, validationResult} = require('express-validator');


rutas.get('/agregar-admin',noestalogeado, (req, res) =>
    {
        res.render('menu_admin/registroadmin')
    } 
)

rutas.post('/agregar-admin',
    noestalogeado,
    body('nombre')
    .exists()
    .isAlpha('en-US', {ignore: ' '}),

    (req, res, next) => 
    {
    
        const errores = validationResult(req);

        if(!errores.isEmpty()){
            console.log(errores.array()) 
            res.redirect('/trampa')
        }
        else{ 
            passport.authenticate( 'registro-local-admin',
                {
                    successRedirect: '/usuario-agregado',
                    failureRedirect : '/usuario-no-agregado',
                    failureFlash: true
                },
            )(req, res, next);
        }


    } 
   
)

rutas.get('/agregar-columnista',noestalogeado,(req, res) => 
    {
        res.render('menu_admin/registrocolumnista.hbs');
    }
)

rutas.post('/agregar-columnista',noestalogeado, passport.authenticate( 'registro-local-columnista',
        {
            successRedirect : '/usuario-agregado',
            failureRedirect : '/usuario-no-agregado',
            failureFlash : true
        }
    )
)

rutas.get('/usuario-agregado',noestalogeado, (req, res) => 
    {
        res.send('usuario agregado');
    }
)

rutas.get('/usuario-no-agregado',noestalogeado, (req, res) => 
    {
        res.send('usuario no agregado');
    }
)

rutas.get('/login',estalogeado, (req, res) => 
    {
        res.render('login/index');
    }
)

rutas.get('/no-encontrado', estalogeado,(req , res) =>  
    {
        res.send('usuario no encontrado')
    }
)

rutas.get('/trampa', (req, res) => 
    {
        res.send('Señor elefante eso que usted hizo eso no se hace, has modificado elementos del html')
    }
)

rutas.post('/login',
    
    estalogeado, 

    body('contraseña')
        .exists()
        .isLength({min:8})
        .isLength({max:15})
        .isAlphanumeric(),
    body('usuario')
        .exists(),
    (req, res, next) => 
    {
        const errores = validationResult(req);
        if(!errores.isEmpty()){
            console.log(errores.array()) 
            res.redirect('/trampa')
        }
        else{

            console.log(req.body.tipoLogin);
            if(req.body.tipoLogin =="administrador"){   
                passport.authenticate('login-administrador', {
                    successRedirect : '/vista-admin',
                    failureRedirect : '/no-encontrado',
                    failureFlash: true
                })(req, res, next);
            }
            else if(req.body.tipoLogin =="columnista"){
                res.send("modulo en produccion")
            }
        }
    }
)

rutas.get('/cerrar-session',noestalogeado, (req, res, next) => 
    {
        req.logOut(req.user, error =>{
            if(error)return next(error);
            else res.redirect('/login');
        });
        
    } 
)




module.exports = rutas;