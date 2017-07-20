var users = require('../controllers/users.js');
var movies = require('../controllers/movies.js');

module.exports = function(app) {
	app.post('/account/register', users.register);
	app.post('/account/login', users.login);
	app.post('/add_movie', movies.add);
	app.post('/delete_movie', movies.delete);
};