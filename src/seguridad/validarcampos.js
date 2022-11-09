
module.exports = {
    validarusuario (usuario){
        let valido = true;

        let cantidad = usuario.length;


        if (cantidad<7 || cantidad==0   ){
            valido = false;
        }


    },
    validarcontraseña (contraseña){

    }
}


