/* eslint-disable no-restricted-syntax */
const gulp      = require( 'gulp' );
const gulpif    = require( 'gulp-if' );
const combiner  = require( 'stream-combiner2' );
const jshint    = require( 'gulp-jshint' );
const eslint    = require( 'gulp-eslint' );
const fLog      = require( 'fancy-log' );
const c         = require( 'ansi-colors' );
const gPrint    = require( 'gulp-print' ).default;
const yargs     = require( 'yargs' ).argv;
const gLess     = require( 'gulp-less' );
const gAprFixer = require( 'gulp-autoprefixer' );
const config    = require( './gulp.config' )();

//----------------------------------------------------------------------------------------------------------------------
const log = ( msg ) => {
  if ( typeof ( msg ) === 'object') {
    for ( const item in msg ) {
      if ( msg.hasOwnProparty( item ) ) {
        fLog( c.cyan( msg[item] ) );
      }
    }
  }
  else {
    fLog( c.cyan( msg ) );
  }
};


//----------------------------------------------------------------------------------------------------------------------
gulp.task( 'vet', () => {
  log( 'Analyzing source with JSHint and ESLint' );
  return combiner.obj([
    gulp
      .src( config.alljs )
      .pipe( gulpif( yargs.verbose, gPrint() ) ) // to print all checked files... gulp vet --verbose
      .pipe( jshint() )
      .pipe( eslint() )
      .pipe( jshint.reporter( 'jshint-stylish', { verbose: true } ) )
      .pipe( jshint.reporter( 'fail' ) ),
  ])
    // any errors in the above streams will get caught
    // by this listener, instead of being thrown:
    .on('error', console.error.bind(console));
});

gulp.task( 'styles', () => {
  log( 'Compiling Less --> CSS' );
  return combiner.obj( [
    gulp
      .src( config.less ) // TODO: add the config
      .pipe( gLess() )
      .pipe( gAprFixer( { browsers: ['last 2 version', '> 5%'] } ) )
      .pipe( gulp.dest( config.temp ) ),
  ])
    .on( 'error', console.error.bind( console ) );
});
