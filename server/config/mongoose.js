var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var models_path = path.join(__dirname, '../models');
var reg = new RegExp('.js$', 'i');
var local_db = 'mongodb://localhost/myfavmovie_db';

mongoose.connect(local_db);

mongoose.connection.on('connected', function() {
	console.log('Mongoose default connection open to ' + local_db);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose default connection eror: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose default connection disconnected');
});

process.on('SIGNIT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

fs.readdirSync(models_path).forEach(function(file) {
	if (reg.test(file)) {
		require(path.join(models_path, file));
	};
});