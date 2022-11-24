
module.exports = {
    estalogeado(req, res, next) {
        if(req.isAuthenticated() ){
            console.log("esta autenticado");
            return next();
        }
        else{
            console.log("trata de entrar sin permisos a asuntos administrativos");
            return res.redirect('/login');
        }
    },

    noestalogeado (req, res, next){
        if(!req.isAuthenticated()){
            console.log("no esta autenticado");
            return next();
        }
        else{
            return res.redirect('/vista-admin');
        }
    },
}
