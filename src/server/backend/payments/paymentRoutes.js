/*
*				libreevent - paymentRoutes.js
*
*	Created by Janis Hutz 08/02/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
// const ph = require( './paymentHandler.js' );
// const paymentHandler = new ph();

module.exports = ( app, settings ) => {
    app.get( '/payments/canceled', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../../ui/en/payments/canceled.html' ) );
    } );
};