module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
            files: {                                   // Dictionary of files
                'index.html': 'index.html',     // 'destination': 'source'
                'about.html': 'about.html',
                'blogs.html': 'blogs.html',
                'projects.html': 'projects.html',
                'shares.html': 'shares.html'
                }
            },
            dev: {                                       // Another target
                files: {
                    'index.html': 'index.html',
                    'about.html': 'about.html',
                    'blogs.html': 'blogs.html',
                    'projects.html': 'projects.html',
                    'shares.html': 'shares.html'
                }
            }
        }
    })
     grunt.loadNpmTasks('grunt-contrib-htmlmin');
     grunt.registerTask('default', ['htmlmin']);
}
