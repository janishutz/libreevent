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
        this.ticketTotals = { 'TestEvent2': { 'ticket1': 5, 'ticket2': 5 } };
        this.settings = { 'maxTickets': 10 };
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

                    if ( this.allSelectedSeats[ data.eventID ].includes( data.id ) && !data.count ) {
                        reject( { 'code': 409, 'message': 'ERR_SEAT_SELECTED' } );
                        return;
                    } 
                    transmit[ data.eventID ][ data.id ] = data;
                    // TODO: Respect max ticket count per user
                    let totalUserTickets = 0;
                    for ( let event in transmit ) {
                        for ( let ticket in transmit[ event ] ) {
                            totalUserTickets += transmit[ event ][ ticket ][ 'count' ] ?? 1;
                        }
                    }
                    if ( totalUserTickets <= this.settings.maxTickets ) {
                        if ( data.count ) {
                            if ( this.ticketTotals[ data.eventID ] ) {
                                if ( data.count <= ( this.ticketTotals[ data.eventID ][ data.id.slice( 0, data.id.indexOf( '_' ) ) ] ?? 1 ) ) {
                                    transmit[ data.eventID ][ data.id ][ 'count' ] = data.count;
                                    this.allSelectedSeats[ data.eventID ].push( { 'id': data.id, 'component': data.component, 'count': data.count } );
                                } else {
                                    reject( { 'code': 409, 'message': this.ticketTotals[ data.eventID ] ?? 1 } );
                                    return;
                                }
                            } else {
                                reject( { 'code': 400, 'message': 'ERR_UNKNOWN_EVENT' } );
                                return;
                            }
                        } else {
                            this.allSelectedSeats[ data.eventID ].push( { 'id': data.id, 'component': data.component } );
                        }
                        console.log( { 'user_id': session.id, 'data': JSON.stringify( transmit ), 'timestamp': new Date().toString() } );
                        db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ), 'timestamp': new Date().toString() } ).then( () => {
                            resolve( 'ok' );
                        } ).catch( () => {
                            reject( { 'code': 500, 'message': 'ERR_DB' } );
                        } );
                    } else {
                        reject( { 'code': 418, 'message': 'ERR_TOO_MANY_TICKETS' } );
                        return;
                    }
                } ).catch( () => {
                    reject( { 'code': 500, 'message': 'ERR_DB' } );
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
                    } ).catch( () => {
                        reject( { 'code': 500, 'message': 'ERR_DB' } );
                    } );
                } ).catch( () => {
                    reject( { 'code': 500, 'message': 'ERR_DB' } );
                } );
            }
        } );
    }

    getReservedSeats ( event ) {
        return this.allSelectedSeats[ event ];
    }
}

module.exports = POSTHandler;