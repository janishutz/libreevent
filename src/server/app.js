/*
*				libreevent - app.js
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
const fs = require( 'fs' );

const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/config/settings.config.json' ) ) );

// const mail = require( './backend/mail/mailSender.js' );
// const mailManager = new mail();

console.log( settings );

if ( settings.init ) {
    app.use( express.static( '../webapp/main/dist' ) );
} else {
    app.use( express.static( '../webapp/setup/dist' ) );
}

// initialise express with middlewares
// TODO: Generate random token
app.use( expressSession( {
    secret: 'gaoevgoawefgo083tq2rfvöfaf0p8',
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'none'
    }
} ) );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( cookieParser() );

let file = path.join( __dirname + '/../webapp/main/dist/index.html' );

if ( settings.init ) {
    require( './admin/adminRoutes.js' )( app, settings ); // admin routes
    require( './admin/adminAPIRoutes.js' )( app, settings ); // admin api routes
    require( './backend/userAPIRoutes.js' )( app, settings ); // admin api routes
    require( './backend/userRoutes.js' )( app, settings ); // user routes
} else {
    require( './setup/setupRoutes.js' )( app, settings ); // setup routes
    file = path.join( __dirname + '/../webapp/setup/dist/index.html' );
}

// TODO: Create plugin loader and manager


app.use( ( request, response ) => {
    response.sendFile( file );
} );

const PORT = process.env.PORT || 8081;
console.log( 'Server listening on Port ' + PORT );
http.createServer( app ).listen( PORT );