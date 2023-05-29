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

module.exports.checkpassword = function checkpassword ( username, password ) {
    return new Promise( resolve => {
        db.getData( 'admin', username ).then( data => {
            resolve( bcrypt.compareSync( password, data ) );
        } );
    } );
};