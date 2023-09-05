/*
*				libreevent - adminAPIRoutes.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const posth = require( './api/postHandler.js' );
const geth = require( './api/getHandler.js' );
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
const mlt = require( 'multer' );
const multer = mlt();
const fs = require( 'fs' );
const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/../config/settings.config.json' ) ) );
const getHandler = new geth( settings );
const postHandler = new posth( settings );


// settings is missing in arguments which shouldn't pose any problem
module.exports = ( app ) => {
    // Add specific routes here to have them be checked first to not get general handling

    app.get( '/admin/getAPI/:call', ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            getHandler.handleCall( req.params.call, req.query ).then( data => {
                res.send( data );
            } ).catch( error => {
                res.status( error.code ?? 500 ).send( error.error );
            } );
        } else {
            res.status( 403 ).sendFile( path.join( __dirname + '/../ui/' + ( req.query.lang ?? 'en' ) + '/errors/403.html' ) );
        }
    } );

    app.post( '/admin/API/:call', bodyParser.json( { limit: '20mb' } ), ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            postHandler.handleCall( req.params.call, req.body, req.query.lang ).then( data => {
                res.send( data );
            } ).catch( error => {
                console.error( error );
                res.status( error.code ?? 500 ).send( error.error );
            } );
        } else {
            res.status( 403 ).sendFile( path.join( __dirname + '/../ui/' + ( req.query.lang ?? 'en' ) + '/errors/403.html' ) );
        }
    } );

    app.post( '/admin/events/uploadImages', multer.array( 'image', 2 ), ( req, res ) => {
        if ( req.query.event.includes( '/' ) || req.query.event.includes( '.' ) ) {
            res.status( 400 ).send( 'fp_wrong' );
        } else {
            for ( let file in req.files ) {
                if ( req.files[ file ].originalname === req.body.logo ) {
                    fs.writeFileSync( path.join( __dirname + '/../assets/events/' + req.query.event + 'Logo.jpg' ), req.files[ file ].buffer );
                } else {
                    fs.writeFileSync( path.join( __dirname + '/../assets/events/' + req.query.event + 'Banner.jpg' ), req.files[ file ].buffer );
                }
            }
            res.send( 'ok' );
        }
    } );

    app.post( '/admin/pages/uploadImages', multer.array( 'image', 1 ), ( req, res ) => {
        if ( req.query.image.includes( '/' ) || req.query.image.includes( '.' ) || req.query.template.includes( '/' ) || req.query.template.includes( '.' )  ) {
            res.status( 400 ).send( 'fp_wrong' );
        } else {
            fs.writeFileSync( path.join( __dirname + '/../ui/home/templates/' + req.query.template + '/' + req.query.image + '.jpg' ), req.files[ 0 ].buffer );
            res.send( 'ok' );
        }
    } );
};