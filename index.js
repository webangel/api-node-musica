'use strict'

var mongoose = require('mongoose');

var app = require('./app');

var port = process.env.PORT || 3977;


// mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res)=>{

// 	//useMongoClient: true,

// 	if(err){
// 		throw err;
// 	}else{
// 		console.log("La conexión a la base de datos está funcionando correctamente...");

// 		app.listen(port, function(){
// 			console.log('Servidor del api rest de musica escuchando en http://localhost:'+port);
// 		});
// 	}

// });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean', { useMongoClient: true })
.then(() => {
	console.log("La conexion a la base de datos curso_mean se ha realizado correctamente...");

	app.listen(port, () =>{
		console.log("Servidor corriendo en http://localhost:3977");
	});
})
.catch(err => console.log(err));