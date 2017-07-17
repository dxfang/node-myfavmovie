var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

var key = '';

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
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

request(options_upcoming, function(err, res, body) {
	if (err) throw new Error(err);

	var movies = JSON.parse(body);
	for (var i = 0; i < movies.results.length; i++) {
		upcoming_movies[i] = {
			id: movies.results[i].id,
			title: movies.results[i].title,
			release_date: movies.results[i].release_date,
			description: movies.results[i].overview,
			image_url: movies.results[i].poster_path
		};
	};
});

app.get('/dashboard', function(req, res) {
	res.render('index', {movies: upcoming_movies});
});

app.post('/search', function(req, res) {
	var options_search = {
		method: 'GET',
		url: 'https://api.themoviedb.org/3/search/movie',
		qs: {
			include_adult: 'false',
			page: '1',
			query: req.body.movie_title,
			language: 'en-US',
			api_key: key
		},
		body: '{}'
	};

	request(options_serach, function (error, response, body) {
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
	res.render('movie', {movie: chosen_movie});
});

app.get('/search_movies/:id', function(req, res) {
	var chosen_movie = search_movies.filter(function(elem) {
		return elem.id == req.params.id;
	})[0];
	res.render('movie', {movie: chosen_movie});
});

app.listen(process.env.PORT || 3000, function() {
	console.log('Server is listening...')
});