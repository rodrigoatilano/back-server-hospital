var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

//Importacion de modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

// ======================================================
// Subir imagenes alservidor
// ======================================================
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de coleccion
    var TiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (TiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es valida',
            errors: { message: 'Tipo de colección no es valida' }
        });
    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }


    //Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var exten = archivo.name.split('.');
    var extencionArchivo = exten[exten.length - 1]

    // Extensiones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.lastIndexOf(extencionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extencionArchivo}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});


// ======================================================
// Asignar imagenes a las colecciones que tenga en DB
// ======================================================
function subirPorTipo(tipo, id, nombreArchivo, res) {

    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {

                if (!usuario) {

                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Usuario no existe',
                        usuario: { message: 'Usuario no existe' }
                    });
                }

                var pathViejo = `./uploads/usuarios/` + usuario.img;

                //Si existe elimina imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                usuario.img = nombreArchivo;

                usuario.save((err, usuarioActualizado) => {

                    usuarioActualizado.password = ':)';

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    });
                });

            });

            break;

        case 'medicos':
            Medico.findById(id, (err, medico) => {

                if (!medico) {

                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Medico no existe',
                        medico: { message: 'Medico no existe' }
                    });
                }

                var pathViejo = `./uploads/medicos/` + medico.img;

                //Si existe elimina imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                medico.img = nombreArchivo;

                medico.save((err, medicoActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada',
                        medico: medicoActualizado
                    });
                });

            });

            break;

        case 'hospitales':

            Hospital.findById(id, (err, hospital) => {

                if (!hospital) {

                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Hospital no existe',
                        hospital: { message: 'Hospital no existe' }
                    });
                }

                var pathViejo = `./uploads/hospitales/` + hospital.img;

                //Si existe elimina imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hospitalActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    });
                });

            });

            break;

        default:
            break;
    }

}

module.exports = app;