var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 2
	},

	password: {
		type: String,
		minlength: 6
	}
}, {
	timestamps: true
});

// UserSchema.methods.generateHash = function(password) {
// 	return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
// };

// UserSchema.methods.validPassword = function(password) {
// 	return bcrypt.compareSync(password, this.password);	
// };

// UserSchema.pre('save', function(done) {
// 	this.password = this.generateHash(this.password);
// 	done();
// });

mongoose.model('User', UserSchema);