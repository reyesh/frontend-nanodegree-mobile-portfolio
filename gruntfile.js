module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    jshint: {
      all: ['Gruntfile.js', 'js/*.js', 'views/js/*.js']
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      }
    },

		processhtml: {
			dist: {
				src: 'index-original.html',
				dest: 'index.html'
			}
		}

	});

  grunt.registerTask('default', [
    'jshint',
    'cssmin',
    'processhtml'
  ]);

};
