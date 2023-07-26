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
const pm = require( './backend/plugins/manager.js' );
const pluginManager = new pm();


console.log( `

_ _ _                                   _   
| (_) |                                 | |  
| |_| |__  _ __ ___  _____   _____ _ __ | |_ 
| | | '_ \\| '__/ _ \\/ _ \\ \\ / / _ \\ '_ \\| __|
| | | |_) | | |  __/  __/\\ V /  __/ | | | |_ 
|_|_|_.__/|_|  \\___|\\___| \\_/ \\___|_| |_|\\__|
                                             
                                             


    -------------------------------
    
    ==> Welcome to libreevent!


    ==> You are running Version V1.0.0

    ==> You should deploy this on a server!

Below you can see all important things that happen during operation.
libreevent logs all errors in the console such that they appear in the
log files when running it with an output pipe.

` );

console.log( '[ Server ] loading settings' );
const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/config/settings.config.json' ) ) );

// const mail = require( './backend/mail/mailSender.js' );
// const mailManager = new mail();

console.log( '[ Server ] Setting up static routes' );
if ( settings.init ) {
    app.use( express.static( '../webapp/main/dist' ) );
} else {
    app.use( express.static( '../webapp/setup/dist' ) );
}

console.log( '[ Server ] loading and initializing middlewares' );
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

console.log( '[ Server ] loading backend components' );
if ( settings.init ) {
    require( './admin/adminRoutes.js' )( app, settings ); // admin routes
    require( './admin/adminAPIRoutes.js' )( app, settings ); // admin api routes
    require( './backend/userAPIRoutes.js' )( app, settings ); // admin api routes
    require( './backend/userRoutes.js' )( app, settings ); // user routes
} else {
    require( './setup/setupRoutes.js' )( app, settings ); // setup routes
    file = path.join( __dirname + '/../webapp/setup/dist/index.html' );
}

console.log( '[ Server ] loading plugins' );
// pluginManager.load( app, settings );

app.use( ( request, response ) => {
    response.sendFile( file );
} );

console.log( '\n\n[ Server ] loading complete!\n\n' );

const PORT = process.env.PORT || 8081;
console.log( '[ Server ] listening on port ' + PORT );
http.createServer( app ).listen( PORT );