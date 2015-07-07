module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'stylesheets/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'stylesheets/',
                    ext: '.min.css'
    }]
  }
}
    })
     grunt.loadNpmTasks('grunt-contrib-cssmin');
     grunt.registerTask('default', ['cssmin']);
}
