
const jwt = require('jsonwebtoken');
require('dotenv').config();
const MySQLStore = require('express-mysql-session');

async function generarToken (usuario){
     return  jwt.sign(
        {
            id : usuario.id,
            rol: usuario.rol
        }
        , process.env.secret);
}

async function validarToken (req, res,) {
  
  const accesstoken = req.cookies;
  
  if(!accesstoken){ res.send("acceso denegado");}
  else{
    console.log(accesstoken);
    try{
    return jwt.verify(accesstoken.token, process.env.secret)
    }catch (error){
      console.log("No hay token ");
    }
  }
}

async function verificarperfil (req, res, next){
  try{
    const dato = await validarToken(req, res).then(token => token);  
    //console.log( typeof(dato));
    console.log(dato);
    if(dato.rol =="admin"){
      next();
    }
    else{
      res.send("acceso denegado")
    }
  }catch(error){
    console.log("No hay token");
    res.send("No tienes permisos")
  }
}

async function validarseccion (req, res, next ){

  try {
    const dato = await validarToken(req, res).then(token => token);

    if(dato.rol=="admin" || dato.rol =="columnista" || dato){
      next();
    }
    else{
      res.send("acceso denegado")
    }

  }catch(error){
    res.send("No tienes permiso")
  }
  
}

async function validarNoexitenciaSeccion (req, res, next){

  const cookie = req.cookies;
  
  try {
    if(!cookie.token){
      next()
    }
    else{  
      const abritoken = await validarToken(req, res).then(token => token)
      if(abritoken.rol=="admin")res.redirect('/vista-admin');
      else if(abritoken.rol=="columnista")res.redirect('/vista-columnista')
    }
  }
  catch(error){
    //if(session.rol=="admin") res.redirect('/vista-admin');
    //else if(session.rol=="columnista") res.redirect('/vista-columnista')
  }
}

//confirmarToken

module.exports = {generarToken, validarToken, verificarperfil,validarseccion,  validarNoexitenciaSeccion}