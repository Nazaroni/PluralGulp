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
const del       = require( 'del' );
const config    = require( './gulp.config' )();


// FUNCTIONS
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

const clean = ( path ) => {
  log( `Cleaning ${c.cyan( path )}` );
  del( path );
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
      .src( config.less )
      .pipe( gLess() )
      .pipe( gAprFixer( { browsers: ['last 2 version', '> 5%'] } ) )
      .pipe( gulp.dest( config.temp ) ),
  ])
    .on( 'error', console.error.bind( console ) );
});

gulp.task( 'clean-styles', ( done ) => {
  const files = `${config.temp}**/*.css`;
  clean( files );
  done();
});

gulp.task( 'less-watcher', () => {
  gulp.watch( [config.less], ['styles'] );
});

// we need to delete 'styles.css' berore run gulp 'styles'
gulp.task( 'runStyles', gulp.series( 'clean-styles', 'styles' ) );
