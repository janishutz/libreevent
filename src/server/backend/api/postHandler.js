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
        this.allSelectedSeats = { 'TestEvent2': [ { 'id': 'secAr1s1', 'component': 1 } ] };
    }

    // Add lang in the future
    handleCall ( call, data, session ) {
        return new Promise( ( resolve, reject ) => {
            if ( call === 'reserveTicket' ) {
                db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                    let transmit = {};
                    if ( dat.length > 0 ) {
                        transmit = JSON.parse( dat[ 0 ].data );
                    } else {
                        transmit[ data.eventID ] = {};
                    }
                    if ( !this.allSelectedSeats[ data.eventID ] ) {
                        this.allSelectedSeats[ data.eventID ] = [];
                    }
                    if ( this.allSelectedSeats[ data.eventID ].includes( data.id ) ) {
                        reject( { 'code': 409, 'message': 'Seat already selected' } );
                    } else {
                        this.allSelectedSeats[ data.eventID ].push( { 'id': data.id, 'component': data.component } );
                        transmit[ data.eventID ][ data.id ] = data;
                        db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ), 'timestamp': new Date().toString() } ).then( () => {
                            resolve( 'ok' );
                        } ).catch( error => {
                            reject( { 'code': 500, 'message': error } );
                        } );
                    }
                } ).catch( error => {
                    reject( { 'code': 500, 'message': error } );
                } );
            } else if ( call === 'deselectTicket' ) {
                db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                    let transmit = JSON.parse( dat[ 0 ].data );
                    if ( transmit[ data.eventID ] ) {
                        if ( transmit[ data.eventID ][ data.id ] ) {
                            delete transmit[ data.eventID ][ data.id ];
                        } else {
                            reject( { 'code': 404, 'message': 'ERR_DATA_NOT_FOUND' } );
                        }
                        if ( Object.keys( transmit[ data.eventID ] ).length < 1 ) {
                            delete transmit[ data.eventID ];
                        }
                    } else {
                        reject( { 'code': 404, 'message': 'ERR_DATA_NOT_FOUND' } );
                    }
                    db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ) } ).then( () => {
                        resolve( 'ok' );
                    } ).catch( error => {
                        reject( { 'code': 500, 'message': error } );
                    } );
                } ).catch( error => {
                    reject( { 'code': 500, 'message': error } );
                } );
            }
        } );
    }

    getReservedSeats ( event ) {
        return this.allSelectedSeats[ event ];
    }
}

module.exports = POSTHandler;