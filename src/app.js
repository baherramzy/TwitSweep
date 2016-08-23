var express = require('express');
var async = require('async');
var Twitter = require('twitter');
var util = require('util');

var app = express();
app.set('view engine', 'jade');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Serve virtual CSS directory 
app.use('/css', express.static('src/css'));
app.use('/css', express.static('src/components/bootstrap/dist/css'));

// Serve virtual fonts directory
app.use('/fonts', express.static('src/fonts'));

// Serve virtual JS directory
app.use('/js', express.static('src/components/jquery/dist'));
app.use('/js', express.static('src/js'));

app.get('/', function(req, res) {
	var mutedUsers = [];
	var blockedUsers = [];

	async.series([
		function(asyncTaskDone) {
			// Muted
			client.get('mutes/users/list', {include_entities: false, skip_status: true}, function(error, data, response) {
				if(error) throw JSON.stringify(error);

				for(var index in data.users) {
					mutedUsers.push({
						username: data.users[index].screen_name, 
						img: data.users[index].profile_image_url
					});
				}

				asyncTaskDone();
			});
		},
		function(asyncTaskDone) {
			// Blocked
			client.get('blocks/list', {include_entities: false, skip_status: true}, function(error, data, response) {
				if(error) throw JSON.stringify(error);

				for(var index in data.users) {
					blockedUsers.push({
						username: data.users[index].screen_name, 
						img: data.users[index].profile_image_url
					});
				}

				asyncTaskDone();
			});
		},
		function(asyncTaskDone) {
			res.render('home', {
				muted: mutedUsers,
				blocked: blockedUsers
			});

			asyncTaskDone();
		}
	]);
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});