/*
*				myevent - app.js
*
*	Created by Janis Hutz 02/26/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const express = require( 'express' );
let app = express();
const path = require( 'path' );
const expressSession = require( 'express-session' );
const fs = require( 'fs' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const favicon = require( 'serve-favicon' );
const http = require( 'http' );
const serveStatic = require( 'serve-static' );

// const env = process.env.PROD || false;

const root = process.env.ROOT || '/order';

const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/config.json' ) ) );


// initialise express with middlewares
app.use( expressSession( {
    secret: 'gaoevgoawefgo083tq2rfvöfaf0p8',
    resave: true,
    saveUninitialized: true
} ) );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( favicon( path.join( __dirname + '/ui/assets/logo.png' ) ) );
app.use( serveStatic( __dirname + '/admin/ui/modules' ) );

require( './admin/routes.js' )( app, settings ); // admin route

if ( settings[ 'init' ] ) {
    if ( root !== '/' ) {
        app.get( '/', ( request, response ) => {
            let lang = request.query.lang || 'en';
            response.sendFile( path.join( __dirname + '/ui/html/' + lang + '/index.html' ) );
        } );
    }
} else {
    app.get( '/', ( request, response ) => {
        response.sendFile( path.join( __dirname + '/ui/html/index.html' ) );
    } );
}


// Assets route for logo, etc
app.get( '/assets/:file', ( request, response ) => {
    response.sendFile( path.join( __dirname + '/ui/assets/' + request.params.file ) );
} );



// CSS route for all user-facing CSS files
app.get( '/css/:file', ( request, response ) => {
    response.sendFile( path.join( __dirname + '/ui/css/' + request.params.file ) );
} );



// create 404 handler
// eslint-disable-next-line no-unused-vars
app.use( ( request, response, next ) => {
    response.sendFile( path.join( __dirname + '/ui/html/en/errorResponses/404.html' ) );
} );

const PORT = process.env.PORT || 8080;
http.createServer( app ).listen( PORT );