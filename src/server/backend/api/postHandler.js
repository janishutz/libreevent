/*
*				libreevent - postHandler.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const db = require( '../db/db.js' );
const fs = require( 'fs' );

class POSTHandler {
    constructor () {
        db.getJSONData( 'booked' ).then( dat => {
            this.allSelectedSeats = dat;
        } );
        // this.allSelectedSeats = { 'test2': { 'secAr1s1': { 'id': 'secAr1s1', 'component': 1 } } };
        this.ticketTotals = { 'test2': { 'ticket1': 5, 'ticket2': 5 } };
        this.settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../config/settings.config.json' ) ) );
    }

    // Add lang in the future
    handleCall ( call, data, session ) {
        return new Promise( ( resolve, reject ) => {
            if ( call === 'reserveTicket' ) {
                if ( data.count || data.count === 0 ) {
                    db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                        if ( dat[ 0 ] ) {
                            let totalTicketsPerID = {};
                            // sum up total of tickets per category (based on a sliced ID of the ticket selected,
                            // as ticketID is based on category and ageGroup)
                            let tickets = JSON.parse( dat[ 0 ].data )[ data.eventID ];
                            for ( let ticket in tickets ) {
                                if ( !totalTicketsPerID[ ticket.slice( 0, ticket.indexOf( '_' ) ) ] ) {
                                    totalTicketsPerID[ ticket.slice( 0, ticket.indexOf( '_' ) ) ] = 0;
                                }
                                totalTicketsPerID[ ticket.slice( 0, ticket.indexOf( '_' ) ) ] += tickets[ ticket ].count;
                            }

                            const id = data.id.slice( 0, data.id.indexOf( '_' ) );
                            
                            if ( !totalTicketsPerID[ id ] ) {
                                totalTicketsPerID[ id ] = 0;
                            }
                            totalTicketsPerID[ id ] += 1;
                            
                            let totalTickets = 0;
                            for ( let category in totalTicketsPerID ) {
                                totalTickets += totalTicketsPerID[ category ];
                            }
                            
                            if ( totalTickets <= this.settings.maxTickets ) {
                                if ( totalTicketsPerID[ id ] <= this.ticketTotals[ data.eventID ][ id ] ) {
                                    let info = {};
                                    info[ data.eventID ] = tickets;
                                    if ( data.count < 1 ) {
                                        if ( Object.keys( info[ data.eventID ] ).length < 1 ) {
                                            delete info[ data.eventID ];
                                        } else {
                                            delete info[ data.eventID ][ data.id ];
                                        }
                                    } else {
                                        info[ data.eventID ][ data.id ] = data;
                                    }
                                    let ticketCount = data.count;
                                    const maxTickets = this.ticketTotals[ data.eventID ][ data.id.slice( 0, data.id.indexOf( '_' ) ) ];
                                    if ( ticketCount > maxTickets ) {
                                        ticketCount = maxTickets;
                                    }
                                    if ( maxTickets > 0 ) {
                                        db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'timestamp': new Date().toString(), 'data': JSON.stringify( info ) } );
                                        resolve( { 'status': 'ok', 'ticketCount': ticketCount } );
                                    } else {
                                        reject( { 'code': 409, 'message': 'ERR_ALL_OCCUPIED' } );
                                    }
                                }
                            } else {
                                reject( { 'code': 418, 'message': 'ERR_TOO_MANY_TICKETS' } );
                            }
                        } else {
                            let info = {};
                            info[ data.eventID ] = {};
                            info[ data.eventID ][ data.id ] = data;
                            let ticketCount = data.count;
                            const maxTickets = this.ticketTotals[ data.eventID ][ data.id.slice( 0, data.id.indexOf( '_' ) ) ];
                            if ( ticketCount > maxTickets ) {
                                ticketCount = maxTickets;
                            }
                            if ( maxTickets > 0 ) {
                                db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'timestamp': new Date().toString(), 'data': JSON.stringify( info ) } );
                                resolve( { 'status': 'ok', 'ticketCount': ticketCount } );
                            } else {
                                reject( { 'code': 409, 'message': 'ERR_ALL_OCCUPIED' } );
                            }
                        }
                    } );
                } else {
                    if ( !this.allSelectedSeats[ data.eventID ] ) {
                        this.allSelectedSeats[ data.eventID ] = {};
                    }
                    if ( this.allSelectedSeats[ data.eventID ][ data.id ] ) {
                        reject( { 'code': 409, 'message': 'ERR_ALREADY_SELECTED' } );
                    } else {
                        let info = {};
                        info[ data.eventID ] = {};
                        info[ data.eventID ][ data.id ] = data;
                        db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'timestamp': new Date().toString(), 'data': JSON.stringify( info ) } ).catch( err => {
                            console.error( err );
                        } );
                        resolve( 'ok' );
                    }
                }
            } else if ( call === 'deselectTicket' ) {
                db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                    let transmit = {};
                    if ( dat[ 0 ] ) {
                        transmit = JSON.parse( dat[ 0 ].data );
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

                        const allSeats = this.allSelectedSeats[ data.eventID ];
                        for ( let seat in allSeats ) {
                            if ( allSeats[ seat ].component === data.component ) {
                                if ( allSeats[ seat ].id === data.id ) {
                                    delete this.allSelectedSeats[ data.eventID ][ seat ];
                                }
                            }
                        }
                    } else {
                        reject( { 'code': 404, 'message': 'ERR_DATA_NOT_FOUND' } );
                        return;
                    }                    

                    db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ) } ).then( () => {
                        resolve( 'ok' );
                    } ).catch( error => {
                        console.error( error );
                        reject( { 'code': 500, 'message': 'ERR_DB' } );
                    } );
                } ).catch( error => {
                    console.error( error );
                    reject( { 'code': 500, 'message': 'ERR_DB' } );
                } );
            }
        } );
    }

    getReservedSeats ( event ) {
        return this.allSelectedSeats[ event ] ? Object.values( this.allSelectedSeats[ event ] ) : {};
    }
}

module.exports = POSTHandler;