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

module.exports = ( app, settings ) => {
    app.post( '/api/reserveTicket', ( request, response ) => {
        db.getData( 'test', request.body );
        response.send( 'ok' );
    } );

    app.post( '/user/login', ( request, response ) => {
        if ( request.body.mail && request.body.password ) {
            pwdmanager.checkpassword( request.body.mail, request.body.password ).then( data => {
                if ( data ) {
                    if ( settings.twoFA === 'standard' ) {
                        let tok = twoFA.registerStandardAuthentication()[ 'token' ];
                        response.send( { 'status': '2fa' } );
                    } else if ( settings.twoFA === 'enhanced' ) {
                        let res = twoFA.registerEnhancedAuthentication();
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
            response.send( 'ok' );
        } else response.send( 'wrong' );
    } );
};