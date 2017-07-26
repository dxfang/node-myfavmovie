var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

app.use(cookieSession({
	name: 'session',
	keys: ['thisisnotasecret']
}));

// Database setting
var mongoose = require('mongoose');
require('./server/config/mongoose.js');
var users = require('./server/controllers/users.js');
var movies = require('./server/controllers/movies.js');
// End database setting

var key = 'c3d1e8df081160561033afe669d2f3ca';

app.use(express.static(__dirname));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var options_upcoming = {
	method: 'GET',
	url: 'https://api.themoviedb.org/3/movie/upcoming',
	qs: {
		region: 'US',
		page: '1',
		language: 'en-US',
		api_key: key
	},
	body: '{}'
};

var upcoming_movies = [];
var search_movies = [];
var my_movies = [];

request(options_upcoming, function(err, res, body) {
	if (err) throw new Error(err);

	var movies = JSON.parse(body);
	for (var i = 0; i < movies.results.length; i++) {
		upcoming_movies.push({
			id: movies.results[i].id,
			title: movies.results[i].title,
			release_date: movies.results[i].release_date,
			description: movies.results[i].overview,
			image_url: movies.results[i].poster_path
		});
	};
	upcoming_movies.sort(function(a, b) {
		return Date.parse(a.release_date) - Date.parse(b.release_date);
	});
});

app.get('/account', function(req, res) {
	res.render('account', {message: {}});
});

app.post('/destroy', function(req, res) {
	req.session.id = null;
	req.session.name = null;
	res.redirect('/');
});

app.get('/', function(req, res) {
	res.redirect('/dashboard');
});
var Movie = mongoose.model('Movie');
app.get('/dashboard', function(req, res) {
	search_movies = [];
	my_movies = [];
	if (req.session.id) {
		Movie.find({_user: req.session.id}, function(err, data) {
			if (err) {
				console.log(err);
			} else {
				for (var i = 0; i < data.length; i++) {
					my_movies[i] = {
						id: data[i].movie_id,
						title: data[i].title,
						release_date: data[i].release_date,
						description: data[i].description,
						image_url: data[i].img_url
					};
				};
				res.render('index', {user: req.session, movies: upcoming_movies, my_movies: my_movies});
			};
		});

	} else {
		res.render('index', {user: req.session, movies: upcoming_movies, my_movies: my_movies});
	}
});

app.post('/search', function(req, res) {
	var options_search = {
		method: 'GET',
		url: 'https://api.themoviedb.org/3/search/movie',
		qs: {
			include_adult: 'false',
			page: '1',
			query: req.body.movie_title + ' ',
			language: 'en-US',
			api_key: key
		},
		body: '{}'
	};

	request(options_search, function (error, response, body) {
		if (error) throw new Error(error);

		var movies = JSON.parse(body);
	  	for (var i = 0; i < movies.results.length; i++) {
			search_movies[i] = {
				id: movies.results[i].id,
				title: movies.results[i].title,
				release_date: movies.results[i].release_date,
				description: movies.results[i].overview,
				image_url: movies.results[i].poster_path
			};
		};
		res.render('search', {movies: search_movies});
	});
});

app.get('/movies/:id', function(req, res) {
	var chosen_movie = upcoming_movies.filter(function(elem) {
		return elem.id == req.params.id;
	})[0];
	console.log(chosen_movie);
	var added = false;
	for (var i = 0; i < my_movies.length; i++) {
		if (chosen_movie.id === my_movies[i].id) {
			added = true;
		}	
	}
	res.render('movie', {user: req.session, movie: chosen_movie, added: added});
});

app.get('/search_movies/:id', function(req, res) {
	var chosen_movie = search_movies.filter(function(elem) {
		return elem.id == req.params.id;
	})[0];
	console.log(chosen_movie);
	var added = false;
	for (var i = 0; i < my_movies.length; i++) {
		if (chosen_movie.id === my_movies[i].id) {
			added = true;
		}
	}
	res.render('movie', {user: req.session, movie: chosen_movie, added: added});
});

app.get('/my_movies/:id', function(req, res) {
	var chosen_movie = my_movies.filter(function(elem) {
		return elem.id == req.params.id;
	})[0];
	res.render('movie', {user: req.session, movie: chosen_movie, added: true});
});

var routes_setter = require('./server/config/routes.js');
routes_setter(app);

app.listen(process.env.PORT || 3000, function() {
	console.log('Server is listening...')
});