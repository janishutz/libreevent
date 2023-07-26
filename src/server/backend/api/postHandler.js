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

    handleCall ( call, data, lang, session ) {
        return new Promise( ( resolve, reject ) => {
            console.log( lang );
            if ( call === 'reserveTicket' ) {
                db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                    let transmit = {};
                    if ( dat.length > 0 ) {
                        transmit = JSON.parse( dat[ 0 ].data );
                    } else {
                        transmit[ data.eventID ] = {};
                    }
                    transmit[ data.eventID ][ data.id ] = data;
                    db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ), 'timestamp': new Date().toString() } ).then( ret => {
                        resolve( ret );
                    } ).catch( error => {
                        reject( error );
                    } );
                } ).catch( error => {
                    reject( error );
                } );
            } else if ( call === 'deselectTicket' ) {
                db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                    let transmit = JSON.parse( dat[ 0 ].data );
                    if ( transmit[ data.eventID ] ) {
                        if ( transmit[ data.eventID ][ data.id ] ) {
                            delete transmit[ data.eventID ][ data.id ];
                        } else {
                            reject( 'ERR_DATA_NONE_EXISTENT' );
                        }
                        if ( Object.keys( transmit[ data.eventID ] ).length < 1 ) {
                            delete transmit[ data.eventID ];
                        }
                    } else {
                        reject( 'ERR_DATA_NONE_EXISTENT' );
                    }
                    db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ) } ).then( ret => {
                        resolve( ret );
                    } ).catch( error => {
                        reject( error );
                    } );
                } ).catch( error => {
                    reject( error );
                } );
            }
        } );
    }
}

module.exports = POSTHandler;