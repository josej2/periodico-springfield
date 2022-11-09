module.exports = {
    noestalogeado(req, res, next){
        if(req.isAuthenticated()){
            console.log("esta autenticado");
            return next();
            
        }
        else{
            return res.redirect('/login');
        }
    },

    estalogeado (req, res, next){
        if(!req.isAuthenticated()){
            console.log("no esta autenticado");
            return next();
        }
        else{
            return res.redirect('/vista-admin');
        }
    }
    
}