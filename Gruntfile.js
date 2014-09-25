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
            index: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/',
                        src: ['index.html'],
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

        concat_sourcemap: {
            options: {},
            lib_css: {
                files: {
                    'static-build/lib.css': [
                        'static/lib/bootstrap/dist/css/bootstrap.css',
                        'static/lib/bootstrap/dist/css/bootstrap-theme.css',
                    ]
                }
            },
            lib_js: {
                files: {
                    'static-build/lib.js': [
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
                    ]
                }
            },
            js: {
                files: {
                    'static-build/all.js': [
                        'static/js/controllers/*.js',
                        'static/js/services/*.js',
                        'static/js/*.js'
                    ]
                }
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
                files: ['static/index.html'],
                tasks: ['copy:index']
            },
            js: {
                files: ['static/js/**'],
                tasks: ['concat_sourcemap:js']
            },
            lib: {
                files: ['static/lib/**'],
                tasks: ['concat_sourcemap:lib_js', 'concat_sourcemap:lib_css']
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
    grunt.loadNpmTasks('grunt-concat-sourcemap');

    grunt.registerTask('default', ['stylus', 'concat_sourcemap', 'copy', 'ngtemplates:partials']);
}