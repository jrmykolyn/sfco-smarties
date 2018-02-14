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
 *
 * NOTE:
 * - `options.globals` must be provided in order to override the default module identifier (which is based on the file name of the module itself).
 */
gulp.task( 'scripts', function() {
	return gulp.src( `${PATHS.src}/*.js` )
		.pipe( babel( {
			presets: [ 'env' ],
			plugins: [
				[ 'transform-es2015-modules-umd', {
					globals: {
						'sfco-smarties': 'Smarties',
					},
					exactGlobals: true,
				} ],
			],
		} ) )
		.pipe( gulp.dest( PATHS.dest ) );
} );
