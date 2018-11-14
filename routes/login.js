var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Erro al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!
        usuarioDB.password = 'XD';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });


        res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB,
            id: usuarioDB._id
        });

    });

});

module.exports = app;