/*
*				libreevent - payrexxRoutes.js
*
*	Created by Janis Hutz 08/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const fs = require( 'fs' );
const path = require( 'path' );
const db = require( '../../../db/db.js' );
const payrexxConfig = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../../../config/payments.config.secret.json' ) ) )[ 'payrexx' ];
const bodyParser = require( 'body-parser' );
const ticket = require( '../../../tickets/ticketGenerator.js' );
const payrexxModule = require( './module.payrexx.js' );
const payrexx = payrexxModule.init();
const TicketGenerator = new ticket();


let sessionReference = {};
let waitingClients = {};
let pendingPayments = {};
let paymentOk = {};

module.exports = ( app, settings ) => {
    app.post( '/payments/prepare', bodyParser.json(), ( req, res ) => {
        if ( req.session.loggedInUser ) {
            let purchase = {
                'successRedirectUrl': settings.yourDomain + '/payments/success',
                'cancelRedirectUrl': settings.yourDomain + '/payments/canceled',
                'failedRedirectUrl': settings.yourDomain + '/payments/failed',
                'currency': settings.currency,
                'basket': [],
                'pm': payrexxConfig.paymentMethods,
                'amount': 0,
            };

            db.getDataSimple( 'temp', 'user_id', req.session.id ).then( dat => {
                if ( dat[ 0 ] ) {
                    db.getJSONData( 'events' ).then( events => {
                        let data = JSON.parse( dat[ 0 ].data );
                        ( async () => {
                            for ( let event in data ) {
                                for ( let item in data[ event ] ) {
                                    purchase[ 'basket' ].push( {
                                        'name': data[ event ][ item ].name,
                                        'quantity': data[ event ][ item ].count ?? 1,
                                        'amount': Math.round( parseFloat( events[ event ][ 'categories' ][ data[ event ][ item ].category ].price[ data[ event ][ item ][ 'ticketOption' ] ] ) * 100 ),
                                    } );
                                    purchase[ 'amount' ] += Math.round( parseFloat( events[ event ][ 'categories' ][ data[ event ][ item ].category ].price[ data[ event ][ item ][ 'ticketOption' ] ] ) * 100 ) * ( data[ event ][ item ].count ?? 1 );
                                }
                            }
                            const response = await payrexx.createGateway( purchase );
                            if ( response.status === 200 ) {
                                const session = response.data.data[ 0 ];
                                sessionReference[ session.id ] = { 'tok': req.session.id, 'email': req.session.username };
                                pendingPayments[ req.session.id ] = true;
                                res.send( session.link );
                            } else {
                                res.status( 500 ).send( 'ERR_PAYMENT' );
                            }
                        } )();
                    } );
                } else {
                    res.status( 400 ).send( 'ERR_UID_NOT_FOUND' );
                }
            } ).catch( error => {
                console.error( '[ STRIPE ] DB ERROR: ' + error );
                res.status( 500 ).send( 'ERR_DB' );
            } );
        } else {
            res.status( 403 ).send( 'ERR_UNAUTHORIZED' );
        }
    } );

    app.get( '/payments/status', ( request, response ) => {
        response.writeHead( 200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        } );
        response.status( 200 );
        response.flushHeaders();
        response.write( 'data: connected\n\n' );
        waitingClients[ request.session.id ] = response;
        const ping = setInterval( () => {
            if ( !pendingPayments[ request.session.id ] ) {
                const stat = TicketGenerator.getGenerationStatus( request.session.id );
                if ( stat === 'done' ) {
                    clearInterval( ping );
                    setTimeout( () => {
                        response.write( 'data: ready\n\n' );
                        response.end();
                        delete waitingClients[ request.session.id ];
                    }, 2000 );
                } else if ( stat === 'noTicket' ) {
                    clearInterval( ping );
                    response.write( 'data: noData\n\n' );
                    response.end();
                    delete waitingClients[ request.session.id ];
                }
            }
        }, 2000 );
    } );

    app.get( '/user/2fa/ping', ( request, response ) => {
        if ( paymentOk[ request.session.id ] === 'ok' ) {
            delete paymentOk[ request.session.id ];
            response.send( { 'status': 'paymentOk' } );
        } else { 
            if ( !pendingPayments[ request.session.id ] ) {
                const stat = TicketGenerator.getGenerationStatus( request.session.id );
                if ( stat === 'done' ) {
                    response.send( { 'status': 'ticketOk' } );
                } else if ( stat === 'noTicket' ) {
                    response.send( { 'status': 'noTicket' } );
                } else {
                    response.send( '' );
                }
            } else {
                response.send( '' );
            }
        }
    } );

    app.post( '/payments/webhook', bodyParser.raw( { type: 'application/json' } ), async ( req, res ) => {
        console.error( req.body );
        const response = await payrexx.getGateway( req.body.id );

        if ( response.status === 200 ) {
            const gateway = response.data.data[ 0 ];
        
            res.status( 200 ).end();
            if ( gateway.status === 'confirmed' ) {
                setTimeout( () => {
                    if ( waitingClients[ sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] ] ) {
                        waitingClients[ sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] ].write( 'data: paymentOk\n\n' );
                    }
                }, 1000 );
                db.getDataSimple( 'temp', 'user_id', sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] ).then( dat => {
                    db.getDataSimple( 'users', 'email', sessionReference[ response.data.data[ 0 ].id ][ 'email' ] ).then( user => {
                        if ( user[ 0 ] ) {
                            const tickets = JSON.parse( dat[ 0 ].data );
                            db.writeDataSimple( 'orders', 'account_id', user[ 0 ].account_id, { 'account_id': user[ 0 ].account_id, 'tickets': dat[ 0 ].data, 'order_name': sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] } ).then( () => {
                                console.log( sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] );
                                TicketGenerator.generateTickets( sessionReference[ response.data.data[ 0 ].id ] );
                                db.getJSONData( 'booked' ).then( ret => {
                                    let booked = ret ?? {};
                                    for ( let event in tickets ) {
                                        if ( !booked[ String( event ) ] ) {
                                            booked[ String( event ) ] = {};
                                        }
                                        for ( let tik in tickets[ event ] ) {
                                            booked[ event ][ tik ] = tickets[ event ][ tik ];
                                        }
                                    }
                                    db.writeJSONData( 'booked', booked ).then( () => {
                                        delete pendingPayments[ sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] ];
                                    } );
                                    db.deleteDataSimple( 'temp', 'user_id', sessionReference[ response.data.data[ 0 ].id ][ 'tok' ] ).catch( error => {
                                        console.error( '[ STRIPE ] ERROR whilst deleting data from DB: ' + error );
                                    } );
                                } );
                            } );
                        } else {
                            console.log( sessionReference[ response.data.data[ 0 ].id ][ 'email' ] );
                            console.error( 'user not found' );
                        }
                    } );
                } ).catch( err => {
                    console.error( err );
                } );
            }
        }
    } );
};