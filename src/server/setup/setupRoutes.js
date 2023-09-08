/*
*				libreevent - setupRoutes.js
*
*	Created by Janis Hutz 07/18/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

// let db = null;
let db = require( '../backend/db/db.js' );
const pwm = require( '../admin/pwdmanager.js' );
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
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.post( '/setup/saveBasicSettings', bodyParser.json(), ( req, res ) => {
        if ( req.session.setupKeyOk ) {
            fs.writeFileSync( path.join( __dirname + '/../config/db.config.json' ), JSON.stringify( req.body.db ) );
            fs.writeFileSync( path.join( __dirname + '/../config/mail.config.json' ), JSON.stringify( req.body.email ) );
            if ( db === null ) {
                db = require( '../backend/db/db.js' );
            }
            let updatedSettings = settings;
            updatedSettings[ 'name' ] = req.body.websiteName;
            updatedSettings[ 'mailSender' ] = req.body.mailDisplay;
            db.saveSettings( updatedSettings );
            res.send( 'ok' );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.post( '/setup/saveRootAccount', bodyParser.json(), ( req, res ) => {
        if ( req.session.setupKeyOk ) {
            pwm.hashPassword( req.body.password ).then( hash => {
                db.writeJSONData( 'rootAccount', { 'pass': hash, 'email': req.body.mail } );
                let updatedSettings = settings;
                updatedSettings[ 'setupDone' ] = true;
                db.saveSettings( updatedSettings );
                res.send( 'ok' );
            } );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.get( '/test/login', ( req, res ) => {
        req.session.setupKeyOk = true;
        res.send( 'ok' );
    } );
};