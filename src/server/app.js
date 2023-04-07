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
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const http = require( 'http' );

// const env = process.env.PROD || false;

// const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/config.json' ) ) );


// initialise express with middlewares
app.use( expressSession( {
    secret: 'gaoevgoawefgo083tq2rfvöfaf0p8',
    resave: true,
    saveUninitialized: true
} ) );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( cookieParser() );
// app.use( favicon( path.join( __dirname + '/ui/assets/logo.png' ) ) );
app.use( express.static( '../webapp/dist' ) );

// require( './admin/routes.js' )( app, settings ); // admin route
app.use( ( request, response ) => {
    response.sendFile( path.join( __dirname + '/../webapp/dist/index.html' ) );
} );

const PORT = process.env.PORT || 8080;
http.createServer( app ).listen( PORT );