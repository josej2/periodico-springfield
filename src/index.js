const express = require('express');
const morgan =  require('morgan');
const exhandlebars = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const conexionmysql = require('./basededatos.js');
const {database} = require('./claves');


const app = express();

require('./lib/passport.js')

//CONFIGURACIONES
//const port = 3200;
app.set('port', process.env.PORT || 3200);
app.set('views', path.join(__dirname,'/views'));
app.engine('.hbs', exhandlebars.engine({
    defaultLayout: 'raiz',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partesDir: path.join(app.get('views'), 'partes'),
    menuadminDir: path.join(app.get('views'), 'menu_admin'),
    //extension de archivos que usara el motor handlebars
    extname: '.hbs',
    helpers: require('./lib/handlebars.js'),
}))
app.set('view engine', '.hbs');


//mediadores

app.use(session({
    secret: 'springfield',
    resave: false,
    saveUninitialized: false,
    store : new MySQLStore(database)
}));


app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use( (req, res, next)=> 
    {
        next();
    }
)


//rutas 
app.use( require('./routers/index.js') );
app.use(require('./routers/autenticacion.js') );
app.use(require('./routers/autenticacion-columnista.js'))
app.use(require('./routers/crud.js') );


//archivos publicos
app.use(express.static(path.join(__dirname, 'public')));


//inicializacion del servidor

app.listen(app.get('port'), ()=> {
    console.log("servidor corriendo");
})