var express = require("express");
var app = express();
var bcrypt = require("bcryptjs"); //llamamos a esta libreria para encriptar contrasenas
var Usuario = require("../models/usuario.js"); //llamamos al modelo
var jwt = require("jsonwebtoken"); // llamamos a la libreria jwt
var mdAutenticacion = require("../middlewares/autenticacion");

// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get("/", function (req, res, next) {
  Usuario.find({}, "nombre email img role") //realizamos una consulta que nos trae todo pero solo con los campos nombre, email, img y role
    .exec((err, usuarios) => {
      //la consulta nos devuelve un error o nos trar algo

      if (err) {
        //si devuelve un error mandamos un status 500

        return res.status(500).json({
          ok: false,
          mensaje: "error cargando usuarios",
          error: err,
        });
      }
      // si no trae un error devolvemos lo que encontramos
      res.status(200).json({
        ok: true,
        usuarios: usuarios, //mostramos los usuarios que encontro la consulta
      });
    });
});
// ==========================================
// FIn de obtener todos los usuarios
// ==========================================

// ==========================================
// Actualizar un nuevo usuario
// ==========================================
app.put("/:id", mdAutenticacion.verificaToken,(req, res) => {
  var id = req.params.id; //obtenemos el id y lo pasamos a una variable
  var body = req.body; //creamos una variable y le asignamos lo que viene en el body.(extraemos el body)

  Usuario.findById(id, (err, usuario) => {
    //cone sta funcion buscamos si existe el usuario que le pasamos en la base
    if (err) {
      //si devuelve un error mandamos un status 500

      return res.status(500).json({
        ok: false,
        mensaje: "error al buscar un usuario",
        error: err,
      });
    }

    if (!usuario) {
      //si viene un usuario vacio devolvemos otro error

      return res.status(400).json({
        ok: false,
        mensaje: "el usuario con el id" + id + "no existe",
        error: { message: "no existe un usuario con ese ID" },
      });
    }

    //si pasamos los if aqui actualizamos el usuario
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    //hacemos la grabacion del usuario modificado
    usuario.save((err, usuarioActualizado) => {
      if (err) {
        //si devuelve un error mandamos un status 400

        return res.status(400).json({
          ok: false,
          mensaje: "error al actualizar un usuario",
          error: err,
        });
      }

      usuarioActualizado.password = ":)"; //mostramos una carita en password

      //si no devuelve error mostramos lo que hemos actualizado correctamente en la base
      res.status(200).json({
        ok: true,
        usuario: usuarioActualizado, //mostramos el usuario creado
        usuariotoken: req.usuario,
      });
    });
  });
});

// ==========================================
// Fin de Actualizar un nuevo ususario
// ==========================================

// ==========================================
// Crear un nuevo usuario
// ==========================================

//el primer parametro es la ruta, el segundo llamamos a la funcion para verificar token y tercero recibimos req y res
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  //hacemos el post

  var body = req.body; //creamos una variable y le asignamos lo que viene en el body.(extraemos el body)

  var usuario = new Usuario({
    //definimos un objeto de tipo del modelo Usuario e inicializamos
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10), //usamos el hash para encriptar
    img: body.img,
    role: body.role,
  });

  //guardamos un usuario
  usuario.save((err, usuarioGuardado) => {
    //la funcion save guardamos el objeto "usuario"

    if (err) {
      //si devuelve un error mandamos un status 400

      return res.status(400).json({
        ok: false,
        mensaje: "error al crear un usuario",
        error: err,
      });
    }
    //si no devuelve error mostramos lo que hemos guardado correctamente en la base
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado, //mostramos el usuario creado
      usuariotoken: req.usuario, //mostramos el usuario que hizo el cargado
    });
  });
});
// ==========================================
// Fin de crear nuevo usuario
// ==========================================

// ==========================================
// Borrar un usuario
// ==========================================

app.delete("/:id", mdAutenticacion.verificaToken,(req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    if (err) {
      //si devuelve un error mandamos un status 500

      return res.status(500).json({
        ok: false,
        mensaje: "error al borrar un usuario",
        error: err,
      });
    }

    if (!usuarioBorrado) {
      //si viene un usuario vacio

      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con ese id",
        error: { message: "No existe un usuario con ese id" },
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado, //mostramos el usuario borado
      usuariotoken: req.usuario,
    });
  });
});

// ==========================================
// Fin de borrar un usuario
// ==========================================

module.exports = app;
