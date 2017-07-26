var mongoose = require('mongoose');
var User = mongoose.model('User');

function UsersController() {
	this.register = function(req, res) {
		User.findOne({name: req.body.username}, function(err, data) {
			if (data != null) {
				console.log('Username taken');
				var message = '*This username has been taken.';
				res.render('account', {message: {name_taken_message: message}});
			} else {
				var newUser = new User({
					name: req.body.username,
					password: req.body.password
				});

				newUser.save(function(err, data) {
					if (err) {
						if (err.errors.name) {
							var name_error_message = '*Must have at least 2 characters.';
						};
						if (err.errors.password) {
							var password_error_message = '*Must have at least 6 characters.';
						};
						res.render('account', {message:
							{
								name_length_message: name_error_message,
								password_length_message: password_error_message
							}
						});
					} else {
						req.session.id = data._id;
						req.session.name = data.name;
						res.redirect('/dashboard');
					};
				});

			}
		})
	};

	this.login = function(req, res) {
		User.findOne({name: req.body.username}, function(err, data) {
			if (data == null) {
				console.log('User does not exist');
				var message = '*User does not exist.';
				res.render('account', {message: {user_not_exist_message: message}});
			} else if (data && data.validPassword(req.body.password)) {
				console.log('Login successful');
				req.session.id = data._id;
				req.session.name = data.name;
				res.redirect('/');
			} else {
				console.log('Password incorrect');
				var message = '*Incorrect password.';
				res.render('account', {message: {password_incorrect_message: message}});
			}
		});
	};
};

module.exports = new UsersController();