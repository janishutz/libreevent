/*
*				libreevent - pwdmanager.js
*
*	Created by Janis Hutz 03/26/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

/* 
    These functions are required to verify user login and to create new users
    and to hash new passwords (if user changes password.) This here is only
    used for the admin panel, another one is used for the normal user accounts
    to separate the two for additional security.
*/

// import and init
const bcrypt = require( 'bcrypt' );
const db = require( '../backend/db/db.js' );

module.exports.checkpassword = ( username, password ) => {
    return new Promise( resolve => {
        if ( username === 'root' ) {
            db.getJSONData( 'rootAccount' ).then( account => {
                bcrypt.compare( password, account.pass ).then( res => {
                    resolve( { 'status': res, 'twoFA': 'enhanced' } );
                } );
            } );
        } else {
            db.getDataSimple( 'admin', 'email', username ).then( data => {
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
        }
    } );
};

module.exports.hashPassword = ( password ) => {
    return new Promise( resolve => {
        resolve( bcrypt.hashSync( password, 10 ) );
    } );
};