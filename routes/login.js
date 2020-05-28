var express = require("express");
var bcrypt = require("bcryptjs"); //llamamos a esta libreria para encriptar contrasenas
var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED; //llamamos al seed o la clave del token
var app = express();
var Usuario = require("../models/usuario.js"); //llamamos al modelo

app.post("/", (req, res) => {
  var body = req.body;
  var email = body.email;

  //con el metodo findone buscamos dentro de la base en el campo email que sea igual al pasado en el body
  Usuario.findOne({ email: body.email }, (err, usuarioEncontrado) => {
    if (err) {
      //preguntamos si devuelve un error mandamos un status 500

      return res.status(500).json({
        ok: false,
        mensaje: "credenciales no validas - fallo el email",
        error: err,
      });
    }

    if (!usuarioEncontrado) {
      //si viene un usuario vacio devolvemos otro error

      return res.status(400).json({
        ok: false,
        mensaje: "el usuario con el email " + email + " no existe",
        error: { message: "no existe un usuario con ese email" },
      });
    }

    //una ves que terminamos de verificar el correo ahora corroboramos la contrasena
    //comparamos el password enviado contra el password del usuario encontrado
    //aqui preguntamos si el password no coincide entonces mandamos un error 400
    if (!bcrypt.compareSync(body.password, usuarioEncontrado.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "credenciales no validas - el password no funciona",
        error: err,
      });
    }

    //CREAMOS EL TOKEN
    usuarioEncontrado.password = ':)'; //mandamos una carita feliz en el token para no mandar el password
    var token = jwt.sign( //funcion para crear el token
      { usuario: usuarioEncontrado }, //mandamos el objeto al cual se le asigna el token
      SEED, //mandamos un parametro unico nuestro
      { expiresIn: 14400 } //aqui mandamos la duracion del token
    ); 

    //respuesta cuando todo funciona correctamente y mostramos los sig valores
    res.status(200).json({
      ok: true,
      usuario: usuarioEncontrado,
      id: usuarioEncontrado._id,
      token: token,
    });
  });
});

//exportamos
module.exports = app;
