/*
*				libreevent - stripeRoutes.js
*
*	Created by Janis Hutz 07/25/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const fs = require( 'fs' );
const path = require( 'path' );
const db = require( '../../../db/db.js' );
const stripConfig = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../../../config/payments.config.secret.json' ) ) )[ 'stripe' ];
const stripe = require( 'stripe' )( stripConfig[ 'APIKey' ] );

const endpointSecret = stripConfig[ 'endpointSecret' ];

// TODO: Remove all selected tickets if timestamp more than user defined amount ago

module.exports = ( app, settings ) => {
    app.post( '/payments/prepare', ( req, res ) => {
        let purchase = {
            'line_items': [],
            'mode': 'payment',
            'success_url': settings.yourDomain + '/payments/success',
            'cancel_url': settings.yourDomain + '/payments/canceled',
            'submit_type': 'book',
            'customer_email': req.body.mail
        };

        db.getDataSimple( 'temp', 'user_id', req.session.id ).then( dat => {
            if ( dat[ 0 ] ) {
                db.getJSONData( 'events' ).then( events => {
                    let data = JSON.parse( dat[ 0 ].data );
                    ( async () => {
                        for ( let event in data ) {
                            for ( let item in data[ event ] ) {
                                purchase[ 'line_items' ].push( {
                                    'price_data': {
                                        'product_data': {
                                            'name': data[ event ][ item ].name,
                                        },
                                        'currency': events[ event ].currency,
                                        'unit_amount': Math.round( parseFloat( events[ event ][ 'categories' ][ data[ event ][ item ].category ].price[ data[ event ][ item ][ 'ticketOption' ] ] ) * 100 ),
                                    },
                                    'quantity': data[ event ][ item ].count ?? 1,
                                } );
                            }
                        }
                        const session = await stripe.checkout.sessions.create( purchase );
                        res.send( session.url );
                    } )();
                } );
            } else {
                res.status( 400 ).send( 'ERR_UID_NOT_FOUND' );
            }
        } ).catch( error => {
            console.error( '[ STRIPE ] DB ERROR: ' + error );
            res.status( 500 ).send( 'ERR_DB' );
        } );
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
    } );

    app.post( '/payments/webhook', ( req, res ) => {
        const payload = req.body;
        const sig = req.headers[ 'stripe-signature' ];
        
        let event;

        try {
            event = stripe.webhooks.constructEvent( payload, sig, endpointSecret );
        } catch ( err ) {
            return res.status( 400 ).send( 'Webhook Error' );
        }

        res.status( 200 ).end();
    } );
};