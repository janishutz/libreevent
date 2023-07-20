/*
*				libreevent - postHandler.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( '../db/db.js' );

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
                        reject( error );
                    } );
                } );
            } else if ( call === 'saveSeatplan' ) {
                db.writeJSONDataSimple( 'seatplan', data.location, { 'draft': {}, 'save': data.data } ).then( resp => { 
                    resolve( resp );
                } ).catch( error => {
                    reject( error );
                } );
            }
        } );
    }
}

module.exports = POSTHandler;