/*
*				libreevent - setupRoutes.js
*
*	Created by Janis Hutz 07/18/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

let db = null;
// const db = require( '../backend/db/db.js' );

module.exports = ( app, settings ) => {
    /* 
        Admin login route that checks the password
    */
   
    app.get( '/setup/start', ( request, response ) => {
        if ( request.query.token === settings.setupToken ) {
            response.send( 'ok' );
        } else {
            response.send( 'incorrect' );
        }
    } );

};