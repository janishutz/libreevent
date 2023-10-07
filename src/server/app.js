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
const cookieParser = require( 'cookie-parser' );
const http = require( 'http' );
const fs = require( 'fs' );
const token = require( './backend/token.js' );
const db = require( './backend/db/db.js' );

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

Below you can see all important things that happen during operation.
libreevent logs all errors in the console such that they appear in the
log files when running it with an output pipe (which you should definitely do)

To do this run the following command when starting libreevent:
'node app.js > libreevent_log.txt'

` );

console.log( '[ Server ] loading settings' );
const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/config/settings.config.json' ) ) );


// Route for static html file for start page (page is compiled using
// Vue SSR and gets its support files (e.g. CSS and JS files) from 
// the /home/supportFiles/:file route plus its assets from the /otherAssets/:file
// route).
if ( settings.setupDone ) {
    app.get( '/', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/ui/home/active/en/index.html' ) );
    } );
}

if ( !settings.init ) {
    db.initDB();
    db.reset();
    let mutSettings = settings;
    mutSettings[ 'init' ] = true;
    db.saveSettings( mutSettings );
}


// Set up static routes for static file serving (performance wise not
// that good, but way easier to set up)
console.log( '[ Server ] Setting up static routes' );
if ( settings.setupDone ) {
    app.use( express.static( 'webapp/main/dist' ) );
} else {
    app.use( express.static( 'webapp/setup/dist' ) );
}

// initialise express with middlewares
console.log( '[ Server ] loading and initializing middlewares' );
app.use( expressSession( {
    secret: token.generateToken( 60 ),
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: 'none',
        httpOnly: false,
        secure: false,
    }
} ) );

app.use( cookieParser() );

let file = path.join( __dirname + '/webapp/main/dist/index.html' );

console.log( '[ Server ] loading backend components' );
if ( settings.setupDone ) {
    require( './backend/helperRoutes.js' )( app, settings ); // Helper routes
    require( './admin/adminRoutes.js' )( app, settings ); // admin routes
    require( './admin/adminAPIRoutes.js' )( app, settings ); // admin api routes
    require( './admin/appApiRoutes.js' )( app, settings ); // app api routes
    require( './backend/userAPIRoutes.js' )( app, settings ); // user api routes
    require( './backend/userRoutes.js' )( app, settings ); // user routes
    require( './backend/payments/paymentRoutes.js' )( app, settings ); // payment routes
    require( './backend/plugins/pluginLoader.js' )( app, settings ); // plugin loader
} else {
    console.log( '[ Setup ] Loading setup routes' );
    require( './setup/setupRoutes.js' )( app, settings ); // setup routes
    file = path.join( __dirname + '/webapp/setup/dist/index.html' );
}

// handling of any unknown route. Returns the SPA index.html file which
// initiates loading of the SPA
app.use( ( request, response ) => {
    response.sendFile( file );
} );

console.log( '\n\n[ Server ] loading complete!\n\n' );

const PORT = process.env.PORT || 8080;
console.log( '[ Server ] listening on port ' + PORT );
http.createServer( app ).listen( PORT );