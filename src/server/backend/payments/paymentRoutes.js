/*
*				libreevent - paymentRoutes.js
*
*	Created by Janis Hutz 08/02/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const fs = require( 'fs' );
// const ph = require( './paymentHandler.js' );
// const paymentHandler = new ph();

module.exports = ( app, settings ) => {
    app.get( '/payments/canceled', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../../ui/en/payments/canceled.html' ) );
    } );

    app.get( '/tickets/tickets.pdf', ( req, res ) => {
        if ( req.session.id ) {
            fs.readFile( path.join( __dirname + '/../tickets/store/' + req.session.id + '.pdf' ), ( error, data ) => {
                if ( error ) res.sendFile( path.join( __dirname + '/../../ui/en/errors/404.html' ) );
                else res.send( data );
            } );
        }
    } );
};