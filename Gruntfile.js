module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		author: 'Baher Ramzy',
		filePostfix: '<%= pkg.name %>-<%= pkg.version %>',
		greetingMsg: 'Running Grunt...'
	});

	
}