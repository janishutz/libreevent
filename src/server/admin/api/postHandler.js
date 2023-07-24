/*
*				libreevent - postHandler.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( '../../backend/db/db.js' );

class POSTHandler {
    constructor () {

    }

    handleCall ( call, data, lang ) {
        return new Promise( ( resolve, reject ) => {
            console.log( lang );
            if ( call === 'saveSeatplanDraft' ) {
                db.getJSONDataSimple( 'seatplan', data.location ).then( res => {
                    let dat = res;
                    dat[ 'draft' ] = data.data;
                    db.writeJSONDataSimple( 'seatplan', data.location, dat ).then( resp => { 
                        resolve( resp );
                    } ).catch( error => {
                        reject( { 'code': 500, 'error': error } );
                    } );
                } );
            } else if ( call === 'saveSeatplan' ) {
                db.writeJSONDataSimple( 'seatplan', data.location, { 'draft': {}, 'save': data.data } ).then( resp => { 
                    resolve( resp );
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'saveLocations' ) {
                db.getJSONData( 'seatplan' ).then( res => {
                    let dat = res;
                    for ( let loc in data.updated ) {
                        if ( res[ loc ] ) {
                            dat[ data.updated[ loc ] ] = res[ loc ];
                            delete dat[ loc ];
                        }
                    }
                    db.writeJSONData( 'seatplan', dat ).catch( error => {
                        reject( { 'code': 500, 'error': error } );
                    } );
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );

                db.writeJSONData( 'locations', data.data ).then( resp => { 
                    resolve( resp );
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else {
                reject( { 'code': 404, 'error': 'Route not found' } );
            }
        } );
    }
}

module.exports = POSTHandler;