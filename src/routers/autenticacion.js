
const express = require('express');
const rutas = express.Router();
const passport = require('passport');
const {body, validationResult} = require('express-validator');
const conexionmysql = require('../basededatos');
const encriptador = require('../lib/encriptadores');
const {verificarperfil, generarToken,  validarNoexitenciaSeccion} = require('../lib/generadoresToken')

rutas.get('/agregar-admin', verificarperfil, (req, res) =>
    {
        res.render('menu_admin/registroadmin')
    } 
)

rutas.post('/agregar-admin',
    verificarperfil,
    body('nombre')
    .exists()
    .isAlpha('en-US', {ignore: ' '}),
    body('apellidos')
    .exists(),
    body('correo')
    .exists()
    .isEmail(),
    body('usuario')
    .exists(),
    body('campo-contraseña')
    .exists(),
    body('password-confirmacion')
    .exists(),

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

rutas.get('/agregar-columnista',verificarperfil,(req, res) => 
    {
        res.render('menu_admin/registrocolumnista.hbs');
    }
)

rutas.post('/agregar-columnista', verificarperfil, passport.authenticate( 'registro-local-columnista',
        {
            successRedirect : '/usuario-agregado',
            failureRedirect : '/usuario-no-agregado',
            failureFlash : true
        }
    )
)

rutas.get('/usuario-agregado',verificarperfil, (req, res) => 
    {
        res.send('usuario agregado');
    }
)

rutas.get('/usuario-no-agregado',verificarperfil, (req, res) => 
    {
        res.send('usuario no agregado');
    }
)

//pendiente de verificacion
rutas.get('/login',  validarNoexitenciaSeccion, (req, res) => 
    {
        res.render('login/index');
    }
)
//pendiente de verificacion
rutas.get('/no-encontrado',(req , res) =>  
    {
        res.send('usuario no encontrado')
    }
)
//pendiente de verificacion
rutas.get('/trampa', (req, res) => 
    {
        res.send('Señor elefante eso que usted hizo eso no se hace, has modificado elementos del html')
    }
)

//pendiente de verificaion
rutas.post('/login',   
    body('contraseña')
        .exists()
        .isLength({min:8})
        .isLength({max:15})
        .isAlphanumeric(),
    body('usuario')
        .exists(),
    async(req, res, next) => 
    {
        const errores = await validationResult(req, res);
        if(!errores.isEmpty()){
            console.log(errores.array()) 
            res.redirect('/trampa')
        }
        else{
            const option = { httpOnly: false,}
            if(req.body.tipoLogin =="administrador"){   
                
                const validar = await validaruseradmin(req, res);
                if (validar.estado) {
                    
                    res .cookie("token", validar.token, option)
                        .redirect('/vista-admin')    
                }
                else res.send("datos incorrectos") //res.redirect('/login')    
            }
            else if(req.body.tipoLogin =="columnista"){
                const validar = await validarusecolumnista (req, res);
                if(validar.estado){

                    res .cookie("token", validar.token, option)
                        .redirect('/vista-columnista')
                }
                else res.send("datos incorrectos")   //res.redirect('/login')
            }
        }
    }
)

rutas.get('/cerrar-session', (req, res, next) => 
    {
        res.clearCookie('token')
            .redirect('/login');
    } 
)


async function validaruseradmin (req, res) {
    
        const arrayconsultas = await conexionmysql.query('select * from administradores where usuario =?',[req.body.usuario.trim()]);
        if( arrayconsultas.length > 0){
            const admin = arrayconsultas[0];
    
            const usuariovalido = await encriptador.comparadorpassword(req.body.contraseña.trim(), admin.contraseña)
            if(usuariovalido){
                console.log("usuario y contraseña validos");
                const usuario = {id : admin.id, rol: "admin" }
                const tokenaccess = await generarToken(usuario);
                console.log(tokenaccess);
                return {estado:true, token:tokenaccess};
            }
        else{ console.log("contraseña incorrecta usuario admin");
            
              return false;
        }
    }
    else{
            console.log("no existe el usuario administrador");
            return false;
    }
}

async function validarusecolumnista (req, res ){
    const arrayconsultas = await conexionmysql.query('Select * from columnistas where usuario =?',[req.body.usuario.trim()]);

    if(arrayconsultas.length>0){
        const columnista = arrayconsultas[0];
        
        const usuariovalido = await encriptador.comparadorpassword(req.body.contraseña.trim(), columnista.contraseña);

        if(usuariovalido){
            console.log("usuario y contraseña encontrados "+columnista.id);
            const usuario = {id: columnista.id, rol:"columnista"}
            const tokenaccess = await generarToken (usuario)
            return {estado: true, token: tokenaccess};
        }
        else{
            console.log("Contraseña incorrecta usuario columnista");
            return false
        }
    }
    else{
        console.log("Usuario columnista inecistente");
        return false;
    }
}


module.exports = rutas;
