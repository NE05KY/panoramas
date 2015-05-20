'use strict';

var gulp = require( 'gulp' ),
    concat = require( 'gulp-concat' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    uglify = require( 'gulp-uglify' ),
    ngAnnotate = require( 'gulp-ng-annotate' ),
    sass = require( 'gulp-sass' ),
    minifyCSS = require( 'gulp-minify-css' ),
    inject = require( 'gulp-inject' ),
    connect = require( 'gulp-connect' ),
    plumber = require( 'gulp-plumber' ),
    notify = require( 'gulp-notify' ),
    copy = require( 'gulp-copy' ),
    rename = require( 'gulp-rename' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    opn = require( 'opn' ),
    del = require( 'del' ),
    mainBowerFiles = require( 'main-bower-files' );

var config = {
    index: {
        src: 'src/index.html',
        dst: 'dist/'
    },
    scripts: {
        src: [ 'src/scripts/*.module.js', 'src/scripts/*.js' ],
        dst: 'dist/scripts'
    },
    styles: {
        src: 'src/styles/*.css',
        dst: 'dist/styles/'
    },
    images: {
        src: 'src/img/*.png',
        dst: 'dist/styles/'
    }
};

var onError = notify.onError( {
    title: 'Error',
    message: '<%= error.message %>'
} );

gulp.task( 'index', function() {
    return gulp.src( config.index.src )
        .pipe( plumber( {
            errorHandler: onError
        } ) )
        //.pipe( inject(
        //    gulp.src(
        //        mainBowerFiles(),
        //        { read: false, cwd: 'bower_components' }
        //    ),
        //    { name: 'bower', addPrefix: 'libs' }
        //) )
        .pipe( gulp.dest( config.index.dst ) )
        .pipe( connect.reload() );
} );

gulp.task( 'scripts', function() {
    return gulp.src( config.scripts.src )
        .pipe( plumber( {
            errorHandler: onError
        } ) )
        //.pipe( sourcemaps.init() )
        .pipe( concat( 'app.min.js' ) )
        .pipe( ngAnnotate() )
        .pipe( uglify() )
        //.pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( config.scripts.dst ) )
        .pipe( connect.reload() );
} );

gulp.task( 'bower', function() {
    return gulp.src( mainBowerFiles(), { base: 'bower_components' } )
        .pipe( copy( config.scripts.dst, { prefix: 3 } ) );
} );

gulp.task( 'images', function() {
    return gulp.src( config.images.src )
        .pipe( gulp.dest( config.images.dst ) )
        .pipe( connect.reload() );
} );

gulp.task( 'styles', function() {
    return gulp.src( config.styles.src )
        .pipe( plumber( {
            errorHandler: onError
        } ) )
        //.pipe( sourcemaps.init() )
        .pipe( concat( 'styles.min.css' ) )
        .pipe( sass() )
        .pipe( autoprefixer( { cascade: false } ) )
        .pipe( minifyCSS() )
        //.pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( config.styles.dst ) )
        .pipe( connect.reload() );
} );

gulp.task( 'clean', function( cb ) {
    del( [ 'dist/' ], cb );
} );

gulp.task( 'connect', function() {
    connect.server( {
        root: 'dist/',
        livereload: true
    } );
} );

gulp.task( 'openBrowser', function() {
    opn( 'http://localhost:8081' );
} );

gulp.task( 'watch', function() {
    connect.server( {
        root: 'dist/',
        livereload: true,
        port: 8081
    } );

    gulp.watch( config.index.src, [ 'index' ] );
    gulp.watch( config.scripts.src, [ 'scripts' ] );
    gulp.watch( config.styles.src, [ 'styles' ] );
    gulp.watch( config.images.src, [ 'images' ] );
} );

gulp.task( 'default', [ 'clean' ], function() {
    gulp.start(
        'index',
        'bower',
        'styles',
        'scripts',
        'images',
        'watch'
    );
    gulp.start( 'openBrowser' );
} );