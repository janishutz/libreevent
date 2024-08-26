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
const bodyParser = require( 'body-parser' );

module.exports = ( app, settings ) => {
    // Add specific routes here to have them be checked first to not get general handling

    app.get( '/getAPI/:call', ( req, res ) => {
        getHandler.handleCall( req.params.call, req.query, req.session, settings ).then( data => {
            if ( req.params.call === 'getReservedSeats' ) {
                let dat = data;
                dat[ 'reserved' ] = postHandler.getReservedSeats( req.query.event );
                res.send( dat );
            } else if ( req.params.call === 'getAllEvents' ) {
                let dat = data;
                const freeSeats = postHandler.getFreeSeatsCount();
                for ( let event in freeSeats ) {
                    dat[ event ][ 'free' ] = freeSeats[ event ];
                }
                res.send( dat );
            } else if ( req.params.call === 'reloadData' ) {
                if ( req.session.loggedInAdmin || req.session.loggedInUser ) {
                    postHandler.loadData();
                    res.send( 'ok' );
                } else {
                    res.status( 403 ).send( 'unauthorized' );
                }
            } else {
                res.send( data );
            }
        } ).catch( error => {
            res.status( error.code ?? 500 ).send( error.message );
        } );
    } );

    app.post( '/API/:call', bodyParser.json(), ( req, res ) => {
        // add lang in the future
        postHandler.handleCall( req.params.call, req.body, req.session ).then( data => {
            res.send( data );
        } ).catch( error => {
            res.status( error.code ?? 500 ).send( error.message );
        } );
    } );
};