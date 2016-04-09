module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngtemplates: {
            partials: {
                cwd: 'static/',
                src: ['partials/*.html', 'partials/*/*.html'],
                dest: 'static-build/partials.js',
                options: {
                    bootstrap:  function(module, script) {
                        return 'var templateCache = function($templateCache) {' + script + '};';
                    },
                    url: function(url) { return '/' + url; }
                }
            }
        },

        stylus: {
            compile: {
                options: {
                    compress: false,
                    /*import: ['nib']*/
                },
                files: {
                    'static-build/css/main.css': ['static/css/*']
                }
            }
        },

        copy: {
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/img/',
                        src: ['**'],
                        dest: 'static-build/img/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/',
                        src: ['*.html'],
                        dest: 'static-build/'
                    },
                ]
            },
            languages: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/languages',
                        src: ['**'],
                        dest: 'static-build/languages'
                    },
                ]
            }
        },

        concat: {
            options: {
                sourceMap: true
            },
            lib_css: {
                src: [
                    'static/lib/bootstrap/dist/css/bootstrap.css',
                    'static/lib/bootstrap/dist/css/bootstrap-theme.css',
                ],
                'dest': 'static-build/lib.css'
            },
            lib_js: {
                src: [
                    'static/lib/jquery/dist/jquery.js',
                    'static/lib/bootstrap/dist/js/bootstrap.js',
                    'static/lib/angular/angular.js',
                    'static/lib/angular-translate/angular-translate.js',
                    'static/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                    'static/lib/underscore/underscore.js',
                    'static/lib/q/q.js',
                    'static/lib/EventEmitter/EventEmitter.js',
                    'static/lib/sockjs/sockjs.js',
                    'static/lib/polyfills/localStorage.js',
                    'static/lib/sockjs/sockjs.js',
                ],
                'dest': 'static-build/lib.js'
            },
            js: {
                src: [
                    'static/js/controllers/*.js',
                    'static/js/services/*.js',
                    'static/js/*.js'
                ],
                'dest': 'static-build/all.js'
            }
        },

        watch: {
            css: {
                files: ['static/css/**'],
                tasks: ['stylus']
            },
            languages: {
                files: ['static/languages/**'],
                tasks: ['copy:languages']
            },
            index: {
                files: ['static/*.html'],
                tasks: ['copy:html']
            },
            js: {
                files: ['static/js/**'],
                tasks: ['concat:js']
            },
            lib: {
                files: ['static/lib/**'],
                tasks: ['concat:lib_js', 'concat:lib_css']
            },
            partials: {
                files: ['static/partials/**'],
                tasks: ['ngtemplates:partials']
            }
        },


    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['stylus', 'concat', 'copy', 'ngtemplates:partials']);
}