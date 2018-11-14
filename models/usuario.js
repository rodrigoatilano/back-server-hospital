var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Generación de Modelos
var Schema = mongoose.Schema;

// Roles
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un ro permitido'
};

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'EL nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El correo es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatorio'] },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico ' });

module.exports = mongoose.model('Usuario', usuarioSchema);