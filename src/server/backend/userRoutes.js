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
                        // TODO: Support both methods of 2fa
                        response.send( '2fa' );
                    } else if ( settings.twoFA === 'enhanced' ) {
                        // TODO: Support both methods of 2fa
                        response.send( '2fa+' );
                    } else {
                        request.session.loggedInUser = true;
                        response.send( 'ok' );
                    }
                } else {
                    response.send( 'pwErr' );
                }
            } );
        } else {
            response.send( 'missingCredentials' );
        }
    } );

    app.get( '/user/2fa', ( request, response ) => {

    } );
};