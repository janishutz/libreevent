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