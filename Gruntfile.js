module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        stylus: {
            compile: {
                files: {
                    'static-build/css/main.css': ['static/css/*'] 
                }
            }
        },

        copy: {
            static: {
                files: [
                    {
                        expand: true, 
                        cwd: 'static/img/', 
                        src: ['**'], 
                        dest: 'static-build/img/'
                    },
                    {
                        expand: true,
                        cwd: 'static/js/', 
                        src: ['**'], 
                        dest: 'static-build/js/'
                    },
                    {
                        expand: true,
                        cwd: 'static/', 
                        src: ['index.html'], 
                        dest: 'static-build/'
                    },
                ]
            }
        },

        watch: {
            files: ['static/**'],
            tasks: ['default']
        },



    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['stylus', 'copy']);
}