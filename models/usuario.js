var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

//creamos un objeto con los roles validos para guardar
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido',
}

//creamos el modelo de usuarios
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del usuario es necesario'] },
    email: { type: String, unique: true ,required: [true, 'El mail del usuario es necesario'] },
    password: { type: String, required: [true, 'La contrasena es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }, //con enum le pasamos los roles validos
});

//aqui mandamos un msj de error para el correo usando el plugin unique-validator
usuarioSchema.plugin( uniqueValidator, { message: 'el {PATH} debe ser unico' } ); //PATH lee la propiedad 

// exportamos lo creado
module.exports = mongoose.model('Usuario', usuarioSchema);