/*
*				libreevent - newsletterRoutes.js
*
*	Created by Janis Hutz 08/13/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const mm = require( '../../../mail/mailSender.js' );
const sendMail = new mm();

module.exports = ( app ) => {
    app.get( '/admin/mail/compose', ( request, response ) => {
        if ( request.session.loggedInAdmin ) {
            response.sendFile( path.join( __dirname + '/html/compose.html' ) );
        } else {
            response.status( 403 ).send( 'unauthenticated' );
        }
    } );

    app.post( '/admin/mail/send', ( request, response ) => {
        if ( request.session.loggedInAdmin ) {
            response.send( 'ok' );
            sendMail.send( request.body.message, request.body.subject, request.body.mode, request.body.replyTo, request.body.receiver, request.body.lang );
        } else {
            response.status( 403 ).send( 'unauthenticated' );
        }
    } );

    app.get( '/mail/unsubscribe', ( request, response ) => {
        response.sendFile( path.join( __dirname + '/html/unsubscribe.html' ) );
    } );

    app.post( '/mail/unsubscribe/go', ( request, response ) => {
        if ( request.body.mail == '' ) {
            response.sendFile( path.join( __dirname + '/html/unsubscribeError.html' ) );
        } else {
            sendMail.unsubscribe( request.body.mail );
            response.sendFile( path.join( __dirname + '/html/unsubscribeComplete.html' ) );
        }
    } );
};