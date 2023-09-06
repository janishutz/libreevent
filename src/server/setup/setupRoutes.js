/*
*				libreevent - setupRoutes.js
*
*	Created by Janis Hutz 07/18/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

let db = null;
const fs = require( 'fs' );
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
// const db = require( '../backend/db/db.js' );

module.exports = ( app, settings ) => {
    /* 
        Setup start route that checks if setup key was correct
    */
   
    app.post( '/setup/start', bodyParser.json(), ( request, response ) => {
        if ( request.body.token === '' + fs.readFileSync( path.join( __dirname + '/../setupkey.txt' ) ) ) {
            response.send( 'ok' );
        } else {
            response.status( 400 ).send( 'incorrect' );
        }
    } );

    app.get( '/setup/getKeyStatus', ( req, res ) => {
        if ( req.session.setupKeyOk ) {
            res.send( 'ok' );
        } else {
            res.status( 403 ).send( 'not authorized' );
        }
    } );

    app.get( '/test/login', ( req, res ) => {
        req.session.setupKeyOk = true;
        res.send( 'ok' );
    } );
};