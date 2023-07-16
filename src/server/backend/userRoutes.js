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

let responseObjects = {};

module.exports = ( app, settings ) => {
    app.post( '/api/reserveTicket', ( request, response ) => {
        db.getData( 'test', request.body );
        response.send( 'ok' );
    } );

    app.post( '/user/login', ( request, response ) => {
        if ( request.body.mail && request.body.password ) {
            pwdmanager.checkpassword( request.body.mail, request.body.password ).then( data => {
                request.session.username = request.body.mail;
                if ( data ) {
                    // TODO: Send mails
                    if ( settings.twoFA === 'standard' ) {
                        let tok = twoFA.registerStandardAuthentication()[ 'token' ];
                        request.session.token = tok;
                        console.log( 'http://localhost:8081/user/2fa?token=' + tok );
                        response.send( { 'status': '2fa' } );
                    } else if ( settings.twoFA === 'enhanced' ) {
                        let res = twoFA.registerEnhancedAuthentication();
                        console.log( 'http://localhost:8081/user/2fa?token=' + res.token );
                        request.session.token = res.token;
                        response.send( { 'status': '2fa+', 'code': res.code } );
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
            responseObjects[ request.query.token ].write( 'data: authenticated\n\n' );
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faSimple.html' ) );
        } else if ( tokType === 'enhanced' ) {
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faEnhanced.html' ) );
        } else {
            response.sendFile( path.join( __dirname + '/../ui/en/2fa/2faInvalid.html' ) );
        }
    } );

    app.post( '/user/2fa/verify', ( request, response ) => {
        let verified = twoFA.verifyEnhanced( request.body.token, request.body.code );
        if ( verified ) {
            request.session.loggedInUser = true;
            responseObjects[ request.body.token ].write( 'data: authenticated\n\n' );
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

    app.get( '/user/logout', ( request, response ) => {
        request.session.loggedInUser = false;
        response.send( 'logoutOk' );
    } );
};