

const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./claves');


//creacion de conexion por hilos

const conexion = mysql.createPool(database);

conexion.getConnection( (error, conexion_respuesta) => {

        if(error){
            if(error.code === 'PROTOCOL_CONNECTION_LOST'){
                console.log("Perdida en la conexion a mysql");
            }
            if(error.code === 'ER_CON_COUNT_ERROR'){
                console.log("Hay demasidas conexiones a la base de datos");
            }
            if(error.code == 'ECONNREFUSE'){
                console.log("Conexion a la base de datos rechaza (contraseña, usuario) incorrectos");
            }   

            console.log("entras al condicional error");
        }

        if (conexion_respuesta){
            conexion_respuesta.release();
            console.log('conexion a la base de datos exitosa');
        }
        return;
    }
);

//aceptacion de promesas para mysql
conexion.query = promisify(conexion.query);

module.exports = conexion;