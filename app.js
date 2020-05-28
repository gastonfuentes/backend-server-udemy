
//Request - importaciones
var express = require('express');
var colors = require('colors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); //traemos a la libreria que usamos para el post


//Inicializar variables
var app = express();

//Body Parse
//EL BODY PARSE SIEMPRE SE VA A EJECUTAR AL SER UN ..
// SI HAY ALGO EN EL BODY QUE NOSOTROS ESTAMOS ENVIANDO EL BODY PARSER LO VA A TOMAR Y VA CREAR EL OBJETO DE JS PARA QUE LO PODAMOS UTILIZAR EN CUALQUIER LUGAR       
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importar rutas
var appRoutes = require('./routes/app'); //esta es la ruta principal
var usuarioRoutes = require('./routes/usuario'); 
var loginRoutes = require('./routes/login'); 


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
app.use('/usuario', usuarioRoutes); 
app.use('/login', loginRoutes); 
app.use('/', appRoutes); //cuando ingresamos a la raiz llamamos a la ruta appRoutes