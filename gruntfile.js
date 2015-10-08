module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    jshint: {
      all: ['Gruntfile.js', 'src/js/*.js', 'src/views/js/*.js']
    },

    uglify: {
        build: {
            src:  'src/views/js/main.js',
            dest: 'src/views/js/main.min.js'
        }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css'],
          dest: 'src/css',
          ext: '.min.css'
        },
        {
          expand: true,
          cwd: 'src/views/css',
          src: ['*.css'],
          dest: 'src/views/css',
          ext: '.min.css'
        }]
      }
    },

    imagemin: {
      dynamic: {
          files: [{
              expand: true,
              cwd: 'src/img/',
              src: ['**/*.{png,jpg,gif}'],
              dest: 'img/'
          },
          {
              expand: true,
              cwd: 'src/views/images/',
              src: ['**/*.{png,jpg,gif}'],
              dest: 'views/images/'
          }]
      }
    },

		processhtml: {
			dist: {
        files: {
          'index.html': ['src/index.html'],
          'project-2048.html': ['src/project-2048.html'],
          'project-mobile.html': ['src/project-mobile.html'],
          'project-webperf.html': ['src/project-webperf.html'],
          'views/pizza.html': ['src/views/pizza.html']
        }
      }
		}

	});

  grunt.registerTask('default', [
    'imagemin',
    'jshint',
    'uglify',
    'cssmin',
    'processhtml'
  ]);

};
