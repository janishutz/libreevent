/*
*				libreevent - db.js
*
*	Created by Janis Hutz 03/26/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const fs = require( 'fs' );

module.exports.getData = function getData ( db, searchQuery ) {
    return new Promise( resolve => {
        resolve( '$2b$05$ElMYWoMjk7567lXkIkee.e.6cxCrWU4gkfuNLB8gmGYLQQPm7gT3O' );
    } );
};

module.exports.writeData = function writeData ( db ) {

};

module.exports.getJSONData = function getData ( file ) {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( path.join( __dirname + '/../../' + file ), ( error, data ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            }
            resolve( JSON.parse( data ) );
        } );
    } );
};

module.exports.getJSONDataSync = function getData ( file ) {
    return JSON.parse( fs.readFileSync( path.join( __dirname + '/../../' + file ) ) );
};