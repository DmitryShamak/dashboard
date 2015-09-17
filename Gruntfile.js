module.exports = function(grunt) {
  var path = __dirname;
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          './public/script.js': [path+'/public/js/*.js']
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['./public/js/main.js', './public/creep.js'],
        dest: './public/script.min.js'
      }
    },
    watch: {
      scripts: {
        files: [path+'/public/js/*.js', path+'/public/js/*/*.js'],
        tasks: ['build'],
        options: {
          livereload: true,
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-browserify-bower');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('build', ['uglify', 'browserify']);

};