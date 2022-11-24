
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
  }catch(error){
    console.log("No hay token");
    res.send("No tienes permisos")
  }
}


//confirmarToken


module.exports = {generarToken, validarToken, verificarperfil}