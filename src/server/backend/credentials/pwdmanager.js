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

module.exports.checkpassword = function checkpassword ( username, password ) {
    return new Promise( resolve => {
        db.getData( 'user', username ).then( data => {
            bcrypt.compare( password, data ).then( data => {
                resolve( data );
            } );
        } );
    } );
};