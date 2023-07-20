/*
*				libreevent - adminAPIRoutes.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const posth = require( './api/postHandler.js' );
const geth = require( './api/getHandler.js' );
const postHandler = new posth();
const getHandler = new geth();
const path = require( 'path' );

// settings is missing in arguments which shouldn't pose any problem
module.exports = ( app ) => {
    // Add specific routes here to have them be checked first to not get general handling

    app.get( '/admin/getAPI/:call', ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            getHandler.handleCall( req.params.call, req.query ).then( data => {
                res.send( data );
            } ).catch( error => {
                res.status( 500 ).send( error );
            } );
        } else {
            res.status( 403 ).sendFile( path.join( __dirname + '/../ui/' + ( req.query.lang ?? 'en' ) + '/errors/403.html' ) );
        }
    } );

    app.post( '/admin/API/:call', ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            postHandler.handleCall( req.params.call, req.body, req.query.lang ).then( data => {
                res.send( data );
            } ).catch( error => {
                res.status( 500 ).send( error );
            } );
        } else {
            res.status( 403 ).sendFile( path.join( __dirname + '/../ui/' + ( req.query.lang ?? 'en' ) + '/errors/403.html' ) );
        }
    } );
};