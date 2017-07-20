var mongoose = require('mongoose');
var Movie = mongoose.model('Movie');
var User = mongoose.model('User');

function MoviesController() {
	this.add = function(req, res) {
		User.findOne({name: req.session.name}, function(err, data) {
			if (err) {
				console.log(err);
			} else {
				var newMovie = new Movie({
					movie_id: req.body.id,
					title: req.body.title,
					release_date: req.body.release_date,
					description: req.body.description,
					img_url: req.body.image_url,
					_user: data._id
				});

				newMovie.save(function(err, info) {
					if (err) {
						console.log(err);
					} else {
						res.redirect('/');
					}
				});
			}
		});
	};

	this.delete = function(req, res) {
		Movie.remove({movie_id: req.body.id, _user: req.session.id}, function(err) {
			if (err) return handleError(err);
			res.redirect('/');
		});
	};
};

module.exports = new MoviesController();