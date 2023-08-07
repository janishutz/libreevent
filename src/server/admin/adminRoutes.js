/*
*				libreevent - routes.js (admin)
*
*	Created by Janis Hutz 03/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

// const db = require( './db/db.js' );
const pwdmanager = require( './pwdmanager.js' );
const auth = require( './2fa.js' );
const twoFA = new auth();
const path = require( 'path' );
const mail = require( '../backend/mail/mailSender.js' );
const mailManager = new mail();
const bodyParser = require( 'body-parser' );

let responseObjects = {};
let authOk = {};

module.exports = ( app, settings ) => {
    /* 
    Admin login route that checks the password
    */
   
    app.post( '/admin/auth', bodyParser.json(), ( request, response ) => {
        if ( request.body.mail && request.body.password ) {
            pwdmanager.checkpassword( request.body.mail, request.body.password ).then( data => {
                request.session.username = request.body.mail;
                if ( data.status ) {
                    request.session.username = request.body.mail;
                    if ( data.twoFA === 'simple' ) {
                        ( async () => {
                            let tok = twoFA.registerStandardAuthentication()[ 'token' ];
                            let ipRetrieved = request.headers[ 'x-forwarded-for' ];
                            let ip = ipRetrieved ? ipRetrieved.split( /, / )[ 0 ] : request.connection.remoteAddress;
                            mailManager.sendMail( request.body.mail, await twoFA.generateTwoFAMail( tok, ip, settings.yourDomain, settings.name ), 'Verify admin account login', settings.mailSender );
                            request.session.token = tok;
                            response.send( { 'status': '2fa' } );
                        } )();
                    } else if ( data.twoFA === 'enhanced' ) {
                        ( async () => {
                            let res = twoFA.registerEnhancedAuthentication();
                            let ipRetrieved = request.headers[ 'x-forwarded-for' ];
                            let ip = ipRetrieved ? ipRetrieved.split( /, / )[ 0 ] : request.connection.remoteAddress;
                            mailManager.sendMail( request.body.mail, await twoFA.generateTwoFAMail( res.token, ip, settings.yourDomain, settings.name ), 'Verify admin account login', settings.mailSender );
                            request.session.token = res.token;
                            response.send( { 'status': '2fa+', 'code': res.code } );
                        } )();
                    } else {
                        request.session.loggedInAdmin = true;
                        response.send( { 'status': 'ok' } );
                    }
                } else {
                    response.send( { 'status': 'pwErr' } );
                }
            } );
        } else {
            response.send( 'missingCredentials' );
        }
    } );

    app.get( '/admin/2fa', ( request, response ) => {
        let tokType = twoFA.verifySimple( request.query.token );
        if ( tokType === 'standard' ) {
            request.session.loggedInAdmin = true;
            responseObjects[ request.query.token ].write( 'data: authenticated\n\n' );
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faSimple.html' ) );
        } else if ( tokType === 'enhanced' ) {
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faEnhancedAdmin.html' ) );
        } else {
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faInvalid.html' ) );
        }
    } );

    app.post( '/admin/2fa/verify', bodyParser.json(), ( request, response ) => {
        let verified = twoFA.verifyEnhanced( request.body.token, request.body.code );
        if ( verified ) {
            request.session.loggedInAdmin = true;
            responseObjects[ request.body.token ].write( 'data: authenticated\n\n' );
            response.send( 'ok' );
        } else response.send( 'wrong' );
    } );

    app.get( '/admin/2fa/check', ( request, response ) => {
        response.writeHead( 200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        } );
        response.status( 200 );
        response.flushHeaders();
        response.write( 'data: connected\n\n' );
        responseObjects[ request.session.token ] = response;
    } );

    app.get( '/admin/2fa/ping', ( request, response ) => {
        if ( authOk[ request.session.token ] === 'ok' ) {
            response.send( { 'status': 'ok' } );
        } else {
            response.send( '' );
        }
    } );

    app.get( '/test/login', ( request, response ) => {
        request.session.loggedInAdmin = true;
        response.send( 'Logged in' );
    } );
    
    app.get( '/admin/logout', ( request, response ) => {
        request.session.loggedInAdmin = false;
        response.send( 'logged out' );
    } );

    app.get( '/api/getAuth', ( request, response ) => {
        response.send( { 'admin': request.session.loggedInAdmin ? true : false, 'user': request.session.loggedInUser ? true : false } );
    } );
};