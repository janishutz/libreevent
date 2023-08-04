/*
*				libreevent - routes.js
*
*	Created by Janis Hutz 07/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( './db/db.js' );
const pwdmanager = require( './credentials/pwdmanager.js' );
const auth = require( './credentials/2fa.js' );
const twoFA = new auth();
const path = require( 'path' );
const mail = require( './mail/mailSender.js' );
const mailManager = new mail();
const bodyParser = require( 'body-parser' );

let responseObjects = {};
let authOk = {};

module.exports = ( app, settings ) => {
    app.get( '/user/details', ( request, response ) => {
        if ( request.session.loggedInUser ) {
            db.getDataSimple( 'users', 'email', request.session.username ).then( data => {
                if ( data[ 0 ] ) {
                    let dat = data[ 0 ];
                    delete dat[ 'pass' ];
                    response.send( { 'data': dat, 'status': true } );
                } else {
                    response.send( { 'data': 'This user does not exist', 'status': false } );
                }
            } ).catch( () => {
                response.send( { 'data': 'There was an error reading data from the database. If this error persists, please contact the administrators', 'status': false } );
            } );
        } else {
            response.status( 403 ).send( path.join( __dirname + '/../ui/en/errors/403.html' ) );
        }
    } );

    app.get( '/test/user', ( req, res ) => {
        req.session.loggedInUser = true;
        req.session.username = 'info@janishutz.com';
        res.send( 'ok' );
    } );

    app.post( '/user/login', bodyParser.json(), ( request, response ) => {
        if ( request.body.mail && request.body.password ) {
            pwdmanager.checkpassword( request.body.mail, request.body.password ).then( data => {
                request.session.username = request.body.mail;
                // TODO: Check if user has 2fa enabled
                if ( data ) {
                    if ( settings.twoFA === 'standard' ) {
                        ( async () => {
                            let tok = twoFA.registerStandardAuthentication()[ 'token' ];
                            let ipRetrieved = request.headers[ 'x-forwarded-for' ];
                            let ip = ipRetrieved ? ipRetrieved.split( /, / )[ 0 ] : request.connection.remoteAddress;
                            mailManager.sendMail( request.body.mail, await twoFA.generateTwoFAMail( tok, ip, settings.yourDomain, settings.name ), 'Verify login', settings.mailSender );
                            request.session.token = tok;
                            response.send( { 'status': '2fa' } );
                        } )();
                    } else if ( settings.twoFA === 'enhanced' ) {
                        ( async () => {
                            let res = twoFA.registerEnhancedAuthentication();
                            let ipRetrieved = request.headers[ 'x-forwarded-for' ];
                            let ip = ipRetrieved ? ipRetrieved.split( /, / )[ 0 ] : request.connection.remoteAddress;
                            mailManager.sendMail( request.body.mail, await twoFA.generateTwoFAMail( res.token, ip, settings.yourDomain, settings.name ), 'Verify login', settings.mailSender );
                            request.session.token = res.token;
                            response.send( { 'status': '2fa+', 'code': res.code } );
                        } )();
                    } else {
                        request.session.loggedInUser = true;
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

    app.get( '/user/2fa', ( request, response ) => {
        // TODO: Add multi language
        let tokType = twoFA.verifySimple( request.query.token );
        if ( tokType === 'standard' ) {
            request.session.loggedInUser = true;
            if ( responseObjects[ request.query.token ] ) {
                responseObjects[ request.query.token ].write( 'data: authenticated\n\n' );
            } else {
                authOk[ request.query.token ] = 'ok';
            }
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faSimple.html' ) );
        } else if ( tokType === 'enhanced' ) {
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faEnhanced.html' ) );
        } else {
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faInvalid.html' ) );
        }
    } );

    app.post( '/user/2fa/verify', bodyParser.json(), ( request, response ) => {
        let verified = twoFA.verifyEnhanced( request.body.token, request.body.code );
        if ( verified ) {
            request.session.loggedInUser = true;
            if ( responseObjects[ request.body.token ] ) {
                responseObjects[ request.body.token ].write( 'data: authenticated\n\n' );
            } else {
                authOk[ request.body.token ] = 'ok';
            }
            response.send( 'ok' );
        } else response.send( 'wrong' );
    } );

    app.get( '/user/2fa/check', ( request, response ) => {
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

    app.get( '/user/2fa/ping', ( request, response ) => {
        if ( authOk[ request.session.token ] === 'ok' ) {
            response.send( { 'status': 'ok' } );
        } else {
            response.send( '' );
        }
    } );

    app.get( '/user/logout', ( request, response ) => {
        request.session.loggedInUser = false;
        response.send( 'logoutOk' );
    } );

    app.post( '/user/signup', bodyParser.json(), ( request, response ) => {
        // TODO: Make sure that user does not exist yet first and if user 
        // exists, send back info that it is that way
        // TODO: check for 2fa
        // TODO: Send mail to confirm email address
        if ( request.body.password && request.body.password === request.body.password2 && request.body.firstName && request.body.name && request.body.country && request.body.mail ) {
            db.checkDataAvailability( 'users', 'email', request.body.mail ).then( status => {
                if ( status ) {
                    response.send( 'exists' );
                } else {
                    db.writeDataSimple( 'users', 'email', request.body.mail, { 'pass': pwdmanager.hashPassword( request.body.password ), 'first_name': request.body.firstName, 'name': request.body.name, 'two_fa': String( request.body.twoFA ), 'user_data': { 'country': request.body.country } } ).then( () => {
                        response.send( 'ok' );
                    } );
                }
            } );
        } else {
            response.status( 400 ).send( 'incomplete' );
        }
    } );
};