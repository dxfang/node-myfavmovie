var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	movie_id: {
		type: Number,
		required: true
	},

	title: {
		type: String,
		required: true
	},

	release_date: {
		type: String,
		required: true
	},

	description: {
		type: String,
		required: true
	},

	img_url: {
		type: String,
		required: true
	},

	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

var Movie = mongoose.model('Movie', MovieSchema);