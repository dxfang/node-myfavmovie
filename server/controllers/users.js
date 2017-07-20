var mongoose = require('mongoose');
var User = mongoose.model('User');

function UsersController() {
	this.register = function(req, res) {
		User.findOne({name: req.body.username}, function(err, data) {
			if (data != null) {
				console.log('User name taken');
			} else {
				var newUser = new User({
					name: req.body.username,
					password: req.body.password
				});

				newUser.save(function(err, data) {
					if (err) {
						console.log(err);
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
			} else if (data && data.validPassword(req.body.password)) {
				console.log('Login successful');
				req.session.id = data._id;
				req.session.name = data.name;
				res.redirect('/');
			} else {
				console.log('Password incorrect');
			}
		});
	};
};

module.exports = new UsersController();