module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      test: ['Gruntfile.js', 'test/**/*.js']
    },
    watch: {
      js: {
        files: ['src/client/js/*.js'],
        tasks: ['jshint', 'browserify']
      },
      compass: {
        files: ['src/client/**/*.scss'],
        tasks: ['compass']
      },
      combineCss: {
        files: ['dist/css/*.css'],
        tasks: ['concat:css']
      },
      combineJs: {
        files: ['src/lib/*.js'],
        tasks: ['concat:js']
      },
      minCss: {
        files: ['dist/style.css'],
        tasks: ['cssmin']
      },
      clientjs: {
        files: ['dist/client.js'],
        tasks: ['uglify:client']
      },
      libjs: {
        files: ['dist/matching.js'],
        tasks: ['uglify:lib']
      },
      copyjs: {
        files: ['dist/matching.min.js', 'client.min.js'],
        tasks: ['copy:js']
      },
      copycss: {
        files: ['dist/style.min.css'],
        tasks: ['copy:css']
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/client.js': ['src/client/js/*.js']
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/client/sass',
          cssDir: 'dist/css'
        }
      }
    },
    concat: {
      css: {
        src: ['dist/css/*.css'],
        dest: 'dist/style.css'
      },
      js: {
        src: ['src/lib/*.js'],
        dest: 'dist/matching.js'
      }
    },
    cssmin: {
      minify: {
        files: {
          'dist/style.min.css': ['dist/style.css']
        }
      }
    },
    uglify: {
      client: {
        files: {
          'dist/client.min.js': ['dist/client.js']
        }
      },
      lib: {
        files: {
          'dist/matching.min.js': ['dist/matching.js']
        }
      }
    },
    copy: {
      css: {
        expand: true,
        flatten: true,
        src: ['dist/style.min.css', 'dist/style.css'],
        dest: 'public/css/'
      },
      js: {
        expand: true,
        flatten: true,
        src: ['dist/client.min.js', 'dist/client.js', 'dist/matching.js', 'dist/matching.min.js'],
        dest: 'public/js/'
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
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['browserify', 'compass', 'concat', 'watch']);
  grunt.registerTask('release', ['browserify', 'compass', 'concat', 'cssmin', 'uglify', 'copy', 'watch']);
  grunt.registerTask('default', ['jshint', 'build']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};
