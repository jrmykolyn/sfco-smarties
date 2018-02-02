// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node

// Vendor
var gulp = require( 'gulp' );
var babel = require( 'gulp-babel' );
var PathMap = require( 'sfco-path-map' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
const PATHS = new PathMap( {
	src: './src',
	dest: './dist',
} );

// --------------------------------------------------
// DEFINE TASKS
// --------------------------------------------------
/**
 * Wrapper around any/all tasks to be executed when `gulp` is run.
 */
gulp.task( 'default', [ 'scripts' ], function() {
	console.log( 'INSIDE TASK: `default`' );
} );

/**
 * Wrapper around any/all script-related tasks.
 */
gulp.task( 'scripts', function() {
	return gulp.src( `${PATHS.src}/*.js` )
		.pipe( babel() )
		.pipe( gulp.dest( PATHS.dest ) );
} );
