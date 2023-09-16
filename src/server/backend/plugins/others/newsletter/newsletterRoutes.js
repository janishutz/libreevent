/*
*				libreevent - newsletterRoutes.js
*
*	Created by Janis Hutz 08/13/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const mm = require( './sender.js' );
const bodyParser = require( 'body-parser' );

module.exports = ( app, settings ) => {
    const sendMail = new mm( settings );
    app.get( '/admin/plugins/newsletter', ( request, response ) => {
        if ( request.session.loggedInAdmin ) {
            response.sendFile( path.join( __dirname + '/html/compose.html' ) );
        } else {
            response.status( 403 ).send( 'unauthenticated' );
        }
    } );

    app.get( '/admin/plugins/newsletter/css/:file', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/css/' + req.params.file ) );
    } );

    app.post( '/admin/plugins/newsletter/send', bodyParser.json(), ( request, response ) => {
        if ( request.session.loggedInAdmin ) {
            response.send( 'ok' );
            sendMail.send( request.body.message, request.body.subject );
        } else {
            response.status( 403 ).send( 'unauthenticated' );
        }
    } );

    app.get( '/mail/unsubscribe', ( request, response ) => {
        response.sendFile( path.join( __dirname + '/html/unsubscribe.html' ) );
    } );

    app.post( '/mail/unsubscribe/go', ( request, response ) => {
        if ( !request.body.mail ) {
            response.sendFile( path.join( __dirname + '/html/unsubscribeError.html' ) );
        } else {
            sendMail.unsubscribe( request.body.mail );
            response.sendFile( path.join( __dirname + '/html/unsubscribeComplete.html' ) );
        }
    } );
};