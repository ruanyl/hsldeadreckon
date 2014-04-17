module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      test: ['Gruntfile.js', 'test/**/*.js']
    },
    watch: {
      js: {
        files: ['src/client/**/*.js'],
        tasks: ['jshint', 'browserify']
      },
      compass: {
        files: ['src/client/**/*.scss'],
        tasks: ['compass']
      },
      combineCss: {
        files: ['dist/**/*.css'],
        tasks: ['concat:css']
      },
      combineJs: {
        files: ['dist/**/*.js'],
        tasks: ['concat:js']
      },
      minCss: {
        files: ['public/css/style.css'],
        tasks: ['cssmin']
      },
      minJs: {
        files: ['public/js/client.js'],
        tasks: ['uglify']
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/js/client.js': ['src/client/**/*.js']
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'dist/css'
        }
      }
    },
    concat: {
      css: {
        src: ['dist/**/*.css'],
        dest: 'public/css/style.css'
      },
      js: {
        src: ['dist/**/*.js'],
        dest: 'public/js/client.js'
      }
    },
    cssmin: {
      minify: {
        files: {
          'public/css/style.min.css': ['public/css/style.css']
        }
      }
    },
    uglify: {
      minify: {
        files: {
          'public/js/client.min.js': ['public/js/client.js']
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', ['browserify', 'compass', 'concat', 'watch']);
  grunt.registerTask('release', ['browserify', 'compass', 'concat', 'cssmin', 'uglify', 'watch']);
  grunt.registerTask('default', ['jshint', 'build']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};
