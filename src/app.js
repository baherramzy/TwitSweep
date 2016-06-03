var express = require('express');
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

client.get('mutes/users/list', function(error, data, response) {
	if(error) throw JSON.stringify(error);

	app.get('/', function(req, res) {
		var mutedUsers = [];

		for(var index in data.users) {
			mutedUsers.push(data.users[index].screen_name);
		}
		

		res.render('home', {
			muted: JSON.stringify(mutedUsers)
		});
	});

	// console.log(JSON.stringify(tweets));
	// console.log(JSON.stringify(response));
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});