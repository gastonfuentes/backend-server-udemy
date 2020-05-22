
//Request - importaciones
var express = require('express');
var colors = require('colors');
var mongoose = require('mongoose');


//Inicializar variables
var app = express();


//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
  if (err) {
      throw err;
    }
    console.log('Base de datos online'.green);
  
});


// Escuchar peticiones
app.listen(3000, function () {
  console.log('Listening on.. servidor express online'.green);
})


//rutas
app.get('/', function (req, res){
    res.status(200).json({
        ok:true,
        mensaje: 'Welcome '
    })
})