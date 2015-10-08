module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    jshint: {
      all: ['Gruntfile.js', 'src/js/*.js', 'src/views/js/*.js']
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css'],
          dest: 'src/css',
          ext: '.min.css'
        }]
      }
    },

		processhtml: {
			dist: {
				src: 'src/index.html',
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
