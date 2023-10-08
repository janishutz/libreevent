/*
*				libreevent - appApiRoutes.js
*
*	Created by Janis Hutz 08/19/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const bodyParser = require( 'body-parser' );
const db = require( '../backend/db/db.js' );
const pwHandler = require( './pwdmanager.js' );

module.exports = ( app ) => {
    console.log( '[ APP API ] Loaded!' );
    app.post( '/app/authenticate', bodyParser.json(), ( req, res ) => {
        pwHandler.checkpassword( req.body.email, req.body.password ).then( status => {
            if ( status ) {
                if ( status.status ) {
                    res.send( 'authOk' );
                } else {
                    res.send( 'wrong' );
                }
            } else {
                res.send( 'wrong' );
            }
        } );
    } );

    app.post( '/app/ticketLookup', bodyParser.json(), ( req, res ) => {
        pwHandler.checkpassword( req.body.email, req.body.password ).then( status => {
            if ( status ) {
                if ( status.status ) {
                    // extract order name
                    let indexOfOrderNameEnd = req.body.ticketID.lastIndexOf( '_' );
                    if ( indexOfOrderNameEnd > req.body.ticketID.length - 5 ) {
                        indexOfOrderNameEnd = req.body.ticketID.slice( 0, req.body.ticketID.length - 5 ).lastIndexOf( '_' );
                    }
                    db.getDataSimple( 'orders', 'order_name', req.body.ticketID.slice( 0, indexOfOrderNameEnd ) ).then( dat => {
                        if ( dat[ 0 ] ) {
                            const tickets = JSON.parse( dat[ 0 ][ 'tickets' ] );
                            const event = req.body.ticketID.slice( indexOfOrderNameEnd + 1, req.body.ticketID.lastIndexOf( '-' ) );
                            const ticket = req.body.ticketID.slice( req.body.ticketID.lastIndexOf( '-' ) + 1, req.body.ticketID.length );
                            if ( tickets[ event ] ) {
                                if ( tickets[ event ][ ticket ] ) {
                                    if ( !tickets[ event ][ ticket ][ 'invalidated' ] ) {
                                        tickets[ event ][ ticket ][ 'invalidated' ] = true;
                                        db.writeDataSimple( 'orders', 'order_name', req.body.ticketID.slice( 0, req.body.ticketID.lastIndexOf( '_' ) ), { 'tickets': JSON.stringify( tickets ) } );
                                        res.send( 'ticketValid' );
                                    } else {
                                        res.send( 'ticketInvalid' );
                                    }
                                } else {
                                    res.send( 'ticketInvalid' );
                                }
                            } else {
                                res.send( 'ticketInvalid' );
                            }
                        } else {
                            res.send( 'ticketInvalid' );
                        }
                    } );
                } else {
                    res.send( 'wrong' );
                }
            } else {
                res.send( 'wrong' );
            }
        } );
    } );
};