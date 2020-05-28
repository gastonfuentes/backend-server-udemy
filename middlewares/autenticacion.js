var jwt = require("jsonwebtoken"); // llamamos a la libreria jwt

var SEED = require("../config/config").SEED; //llamamos al seed o la clave del token

// ==========================================
// VARIFICAR TOKEN - CREAR MIDDLEWARE
// ==========================================

exports.verificaToken = function (req, res, next) {
  var token = req.query.token; //obtenemos el token por la peticion url

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      //si devuelve un error mandamos un status 401

      return res.status(401).json({
        ok: false,
        mensaje: "token no valido",
        error: err,
      });
    }

    // res.status(200).json({
    //   ok: true,
    //   decoded: decoded, //el decoded imprime el usuario que esta haciendo la peticion
    // });

    req.usuario = decoded.usuario; //ponemos a disposicion el usuario que esta haciendo la peticion     

    next(); //con next indicamos que puede seguir ejecutandose el codigo



  });
};

// ==========================================
// FIN DE VERIFICAR TOKEN
// ==========================================
