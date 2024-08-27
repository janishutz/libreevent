/*
*				libreevent - setupRoutes.js
*
*	Created by Janis Hutz 07/18/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

let db = null;
let pwm = null;
const fs = require( 'fs' );
const path = require( 'path' );
const bodyParser = require( 'body-parser' );


module.exports = ( app, settings ) => {
    let isSetupComplete = settings.setupDone;
    /* 
        Setup start route that checks if setup key was correct
    */
   
    app.post( '/setup/start', bodyParser.json(), ( request, response ) => {
        if ( request.body.token === '' + fs.readFileSync( path.join( __starterDir + '/setupkey.txt' ) ) ) {
            request.session.setupKeyOk = true;
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
            fs.writeFileSync( path.join( __starterDir + '/config/db.config.json' ), JSON.stringify( req.body.db ) );
            let emailSettings = {};
            emailSettings[ 'host' ] = req.body.email.host;
            emailSettings[ 'port' ] = req.body.email.port;
            emailSettings[ 'secure' ] = false;
            emailSettings[ 'auth' ] = { 'user': req.body.email.user, 'pass': req.body.email.pass };
            let hostSplit = req.body.email.host.split( '.' );
            emailSettings[ 'tls' ] = { 'servername': ( hostSplit[ hostSplit.length - 2 ] + '.' + hostSplit[ hostSplit.length - 1 ] ) };
            fs.writeFileSync( path.join( __starterDir + '/config/mail.config.json' ), JSON.stringify( emailSettings ) );
            if ( db === null ) {
                db = require( '../backend/db/db.js' );
                pwm = require( '../admin/pwdmanager.js' );
            }
            let updatedSettings = settings;
            updatedSettings[ 'name' ] = req.body.websiteName;
            updatedSettings[ 'yourDomain' ] = req.body.yourDomain;
            updatedSettings[ 'mailSender' ] = req.body.mailDisplay;
            db.saveSettings( updatedSettings );
            res.send( 'ok' );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.post( '/setup/saveRootAccount', bodyParser.json(), ( req, res ) => {
        if ( req.session.setupKeyOk ) {
            if ( db === null ) {
                db = require( '../backend/db/db.js' );
                pwm = require( '../admin/pwdmanager.js' );
            }
            pwm.hashPassword( req.body.password ).then( hash => {
                db.writeJSONData( 'rootAccount', { 'pass': hash, 'email': req.body.mail } );
                let updatedSettings = settings;
                updatedSettings[ 'setupDone' ] = true;
                updatedSettings[ 'init' ] = true;
                db.saveSettings( updatedSettings );
                isSetupComplete = true;
                ( async () => {
                    await db.initDB();
                    db.reset();
                    res.send( 'ok' );
                } )();
            } );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.get( '/getSetupStatus', ( req, res ) => {
        res.send( isSetupComplete );
    } );
};