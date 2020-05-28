
var express = require('express');
var app = express();

app.get('/', function (req, res){
    res.status(200).json({
        ok:true,
        mensaje: 'Welcome '
    })
})


module.exports = app;