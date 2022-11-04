'use strict'

var path = require('path');
var fs = require('fs');
var monoosePaginate = require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
//res.status(200).send({message: 'Controlador canción'});
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la petición '});
		}else{
			if(!song){
				res.status(404).send({message: 'El canción no existe'});	
			}else{
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req, res){
 var albumId = req.params.album;
	
	if(!albumId){
		//Sacar todos los albunes de la BD
		var find = Song.find({}).sort('number');
	}else{
		//sacar los albunes de un artista concreto de la BD
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
			path: 'album',
			populate: {
				path: 'artist',
				model: 'Artist'	
			}
		}).exec((err, songs) => {
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!songs){
				res.status(200).send({message: 'No hay Canciones'});
			}else{
				res.status(200).send({songs});
			}
		}
	});	
}

function saveSong(req, res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, SongStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!SongStored){
				res.status(404).send({message: 'No se ha guardado el album'});
			}else{
				res.status(200).send({song: SongStored});
			}
		}
	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor.'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'La canción no ha sido actualizada'});
			}else{
				res.status(200).send({song: songUpdated});
			}

		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;

		Song.findByIdAndRemove(songId, (err, SongRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!SongRemoved){
				res.status(404).send({message: 'La canción no ha sido eliminado'});
			}else{
				res.status(404).send({song: SongRemoved});
				
			}
		}
	});
}

function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){
            
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) =>{
				
				if(!songUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la canción'});
					//console.log('guardar');
				}else{
					res.status(200).send({song: songUpdated});
					//console.log('error');
				}

			});

		}else{
			res.status(200).send({message: 'Extensión de archivo no valido'});
		}

		console.log(file_path);

	}else{

		res.status(200).send({message: 'No has subido el fichero de audio'});
	}
}

function getSongFile(req, res){
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe el fichero de audio...'});
		}
	});
}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}