// Requires
var express = require('express');
var mongoose = require('mongoose');
var mysql = require('mysql');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Conexion a ala base de datos

// MONGO DB

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos Mongo DB: \x1b[32m%s\x1b[0m', 'en linea');

});


// MySQL
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'encuestas',
//     port: 3306
// });
// connection.connect(function(error) {
//     if (error) {
//         throw error;
//     } else {
//         console.log('Base de datos MySQL: \x1b[32m%s\x1b[0m', 'en linea');
//     }
// });
// connection.end();




// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuariosRoutes);
app.use('/', appRoutes); // -> Midelware



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'en linea');
});