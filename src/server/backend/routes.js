/*
*				libreevent - routes.js
*
*	Created by Janis Hutz 07/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( './db/db.js' );

module.exports = ( app, settings ) => {
    app.post( '/api/reserveTicket', ( request, response ) ) {
        db.getData( 'test', request.body );
        response.send( 'ok' );
    };
};