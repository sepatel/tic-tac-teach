module.exports = function(grunt) {
  'use strict';
  grunt.util.linefeed = '\n'; // Force use of Unix newlines

  RegExp.quote = function(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['src/main/resources/ui/js/*.js', 'src/main/resources/ui/css/*.css']
    },
    concat: {
      app: {
        src: ['src/main/angularjs/**/*.js'],
        dest: 'src/main/resources/ui/js/app.js'
      },
      vendor: {
        src: ['node_modules/angular/angular.min.js', 'node_modules/angular-animate/angular-animate.min.js',
          'node_modules/angular-aria/angular-aria.min.js', 'node_modules/angular-messages/angular-messages.min.js',
          'node_modules/angular-route/angular-route.min.js', 'node_modules/angular-material/angular-material.min.js'],
        dest: 'src/main/resources/ui/js/vendor.js'
      }
    },
    less: {
      compileApp: {
        options: {strictMath: true, sourceMap: false, outputSourceFiles: true},
        files: {
          'src/main/resources/ui/css/app.css': ['src/main/less/app.less']
        }
      },
      compileVendor: {
        options: {strictMath: true, sourceMap: false, outputSourceFiles: true},
        files: {
          'src/main/resources/ui/css/vendor.css': ['node_modules/angular-material/angular-material.min.css']
        }
      }
    },
    watch: {
      app: {files: ['src/main/angularjs/**/*.js'], tasks: ['concat:app']},
      lessApp: {files: ['src/main/less/**/*.less'], tasks: ['less:compileApp']},
      vendor: {files: ['node_modules'], tasks: ['concat:vendor', 'less:compileVendor']}
    }
  });

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.registerTask('build', ['clean', 'concat', 'less'])
};
