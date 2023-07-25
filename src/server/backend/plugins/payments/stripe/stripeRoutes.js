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
const stripe = require( 'stripe' )( fs.readFileSync( path.join( __dirname + '/../../../../config/payments.config.secret.json' ) )[ 'stripe' ][ 'APIKey' ] );

module.exports = ( app, settings ) => {
    app.post( '/payments/prepare', async ( req, res ) => {
        let purchase = {
            'line_items': [],
            'mode': 'payment',
            'success_url': settings.yourDomain + '/payments/success',
            'cancel_url': settings.yourDomain + '/payments/canceled',
            'submit_type': 'book',
            'customer_email': req.body.customer.mail
        };

        for ( let item in req.body.products ) {
            purchase[ 'line_items' ].push( {
                'price_data': {
                    'currency': req.body.currency,
                    'product_data': {
                        'name': req.body.products[ item ].name,
                    },
                    'unit_amount': req.body.products[ item ].price
                },
                'quantity': req.body.products[ item ].count ?? 1,
            } );
        }
        const session = await stripe.checkout.sessions.create( purchase );
        res.send( session.url );
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
        // The webhook stripe sends data to
    } );
};