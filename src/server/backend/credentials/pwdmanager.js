/*
*				libreevent - pwdmanager.js
*
*	Created by Janis Hutz 07/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

/* 
    These functions are required to verify user login and to create new users
    and to hash new passwords (if user changes password.)
*/

// import and init
const bcrypt = require( 'bcrypt' );
const db = require( '../db/db.js' );
const mm = require( '../mail/mailSender.js' );
const mailManager = new mm();
const fs = require( 'fs' );
const path = require( 'path' );
const token = require( '../token.js' );
let createSSRApp = require( 'vue' ).createSSRApp;
let renderToString = require( 'vue/server-renderer' ).renderToString;

const settings = JSON.parse( fs.readFileSync( path.join( __starterDir + '/config/settings.config.json' ) ) );

module.exports.checkpassword = function checkpassword ( email, password ) {
    return new Promise( resolve => {
        db.getDataSimple( 'user', 'email', email ).then( data => {
            if ( data ) {
                if ( data[ 0 ] ) {
                    bcrypt.compare( password, data[ 0 ].pass ).then( res => {
                        resolve( { 'status': res, 'twoFA': data[ 0 ].two_fa } );
                    } );
                } else {
                    resolve( false );
                }
            } else {
                resolve( false );
            }
        } );
    } );
};

module.exports.hashPassword = ( password ) => {
    return new Promise( resolve => {
        resolve( bcrypt.hashSync( password, 10 ) );
    } );
};

module.exports.resetPassword = ( email ) => {
    return new Promise( ( resolve, reject ) => { 
        db.checkDataAvailability( 'users', 'email', email ).then( dat => {
            if ( dat ) {
                const newPW = token.generateToken( 20 );
                this.hashPassword( newPW ).then( hash => {
                    ( async () => {
                        db.writeDataSimple( 'users', 'email', email, { 'pass': hash } );
                        const app = createSSRApp( {
                            data() {
                                return {
                                    password: newPW,
                                    host: settings.yourDomain
                                };
                            },
                            template: '' + fs.readFileSync( path.join( __dirname + '/../../ui/en/signup/pwReset.html' ) )
                        } );
                        
                        mailManager.sendMail( email, await renderToString( app ), 'Password reset', settings.mailSender );
                        resolve( 'ok' );
                    } )();
                } );
            } else {
                reject( { 'code': 404, 'message': 'ERR_USER_NOT_FOUND' } );
            }
        } );
    } );
};