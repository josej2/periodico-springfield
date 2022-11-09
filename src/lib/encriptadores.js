const bcrypt = require('bcryptjs')

const encriptadores = {};

encriptadores.encriptarpassword =  async (password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    return passwordEncriptada;
};

encriptadores.comparadorpassword =  async (password, passwordmysqluser ) => {

    try{
        return await bcrypt.compare(password, passwordmysqluser);
    }catch (e){
        console.log("error catch comparacion "+ e);
    }
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    return passwordEncriptada;
};

module.exports = encriptadores;