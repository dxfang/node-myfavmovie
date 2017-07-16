var express = require('express');
var app = express();
var request = require('request');
// var bodyParser = require('body-parser');

var key = '';

app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({ extended: true}));
// app.use(bodyParser.json());

var options = {
	method: 'GET',
	url: 'https://api.themoviedb.org/3/movie/upcoming',
	qs: {
		page: '1',
		language: 'en-US',
		api_key: key
	},
	body: '{}'
};

var upcoming_movies = [];

request(options, function(err, res, body) {
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

app.get('/movies/:id', function(req, res) {
	res.render('movie');
});

app.listen(process.env.PORT || 3000, function() {
	console.log('Server is listening...')
});