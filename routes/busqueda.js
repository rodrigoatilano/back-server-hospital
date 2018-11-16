var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ======================================================
// Busqueda por coleciones
// ======================================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;

    var expreg = new RegExp(busqueda, 'i');

    var promesa;

    switch ( tabla ) {
        case 'hospitales':
            
            promesa = buscarHospitales(busqueda, expreg);  

            break;
        case 'medicos':
    
            promesa = buscarMedicos(busqueda, expreg);  

            break;
        case 'usuarios':
    
            promesa = buscarUsuarios(busqueda, expreg);        

            break;

        default:
            
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales ',
                error: {message: 'Tipo de tabla/coleccion no valido'}
            });
    }

    promesa.then( data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })



});


// ======================================================
// Busqueda general
// ======================================================
app.get('/todo/:busqueda', (req, res, next) => {


    var busqueda = req.params.busqueda;
    var expreg = new RegExp(busqueda, 'i'); //expresion regular insencible a mayusculas para las coincidencias de palabras


    Promise.all([ //implementar promesas
            buscarHospitales(busqueda, expreg),
            buscarMedicos(busqueda, expreg),
            buscarUsuarios(busqueda, expreg)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });
});


function buscarHospitales(busqueda, expreg) {
    //promesa hospitales
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: expreg })
            .populate('usuario', 'nombre email') //para cambiar el ID de usuario por sus datos
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });
    });

}

function buscarMedicos(busqueda, expreg) {
    //promesa medicos
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: expreg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });
    });

}


function buscarUsuarios(busqueda, expreg) {
    //promesa usuarios
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': expreg }, { 'email': expreg }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            })
    });

}
module.exports = app;