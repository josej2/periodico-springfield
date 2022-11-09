const passport = require("passport");
const strategy = require('passport-local').Strategy;
const conexionmysql = require('../basededatos');
const encriptador = require('../lib/encriptadores')

passport.use( 'registro-local-admin', new strategy 
    (
        {
            usernameField: 'usuario',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, usuario, contraseña, done ) => 
        {
            const {nombre, apellidos, correo} = req.body;

            const nuevousuario = {
                nombre,
                apellidos,
                correo,
                usuario,
                contraseña
            }
            nuevousuario.contraseña = await encriptador.encriptarpassword(contraseña);
            const resultadoinserccion = await conexionmysql.query('Insert into administradores set?', [nuevousuario]);
            nuevousuario.id = resultadoinserccion.insertId;
            return done(null, nuevousuario);
        }

    )
);

passport.use( 'registro-local-columnista', new strategy 
    (
        {
            usernameField: 'usuario',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, usuario, contraseña, done ) => 
        {
            const {nombre, apellidos, correo} = req.body;

            const nuevousuario = {
                nombre,
                apellidos,
                correo,
                usuario,
                contraseña
            }
            nuevousuario.contraseña = await encriptador.encriptarpassword(contraseña);
            const resultadoinserccion = await conexionmysql.query('Insert into columnistas set?', [nuevousuario]);
            nuevousuario.id = resultadoinserccion.insertId;
            return done(null, nuevousuario);
        }

    )
);

passport.use('login-administrador', new strategy 
    (
        {
            usernameField :'usuario',
            passwordField : 'contraseña',
            passReqToCallback: true
        },
        async ( req, usuario, contraseña, done) => {

            const arrayconsultas = await conexionmysql.query('select * from administradores where usuario =?',[usuario.trim()]);
            
            if( arrayconsultas.length > 0){
                const admin = arrayconsultas[0];

                const usuariovalido = await encriptador.comparadorpassword(contraseña.trim(), admin.contraseña)
                if(usuariovalido){
                    console.log("usuario y contraseña encontrados"+admin.id);
                    return done(null,admin) 
                }
                else{
                    console.log("contraseña incorrecta");
                    //done(null, false, req.flash('contraseña incorrecta'));
                    return done(null, false);
                }
            }
            else{
                console.log("no existe el usuario");
                //done(null, false, req.flash('usuario no existe'));
                done(null, false);
            }
        }
    )
) 


passport.serializeUser ( (usuario, done) =>

    {
        done(null, usuario.id)
    }
);

passport.deserializeUser( async (id, done) => 
    {
       const  arregloconsultasadmin = await conexionmysql.query('select * from administradores where id= ?',[id] );
       
       done(null, arregloconsultasadmin[0]);
       
    } 
)
