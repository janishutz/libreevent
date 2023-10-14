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
const pwHandler = require( '../credentials/pwdmanager.js' );

class POSTHandler {
    constructor () {
        this.loadData();
        
        this.temporarilySelected = {};
        this.temporarilySelectedTotals = {};
        this.temporaryTotals = {};
        this.freeSeats = {};
        this.settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../config/settings.config.json' ) ) );

        /*
            Here, GC-Duty is scheduled to run every so often (defined in settings.config.json file, no GUI setting available.
            If you are a developer and are thinking about adding a GUI setting for this, please consider that this is a
            advanced setting and many people might not understand what it changes. The config file is mentioned in the 
            "advanced settings" section of the admin panel documentation where all the available settings in the config file
            are explained in some detail.)
        */
        setInterval( () => {
            this.gc();
        }, parseInt( this.settings.gcInterval ) * 1000 );
    }

    loadData () {
        db.getJSONData( 'booked' ).then( dat => {
            this.allSelectedSeats = dat;
            db.getJSONData( 'events' ).then( dat => {
                this.events = dat;
                this.ticketTotals = {};
                for ( let event in this.events ) {
                    this.ticketTotals[ event ] = this.events[ event ][ 'totalSeats' ];
                }

                for ( let event in this.allSelectedSeats ) {
                    for ( let t in this.allSelectedSeats[ event ] ) {
                        if ( this.allSelectedSeats[ event ][ t ][ 'count' ] ) {
                            this.ticketTotals[ event ] -= parseInt( this.allSelectedSeats[ event ][ t ][ 'count' ] );
                        } else {
                            this.ticketTotals[ event ] -= 1;
                        }
                    }
                }
                this.countFreeSeats();
            } );
        } );
    }

    gc() {
        // this function acts as the database garbage collector. TicketTimeout can be changed from the GUI.
        db.getData( 'temp' ).then( tempData => {
            let data = tempData;
            console.info( '[ DB ] Garbage Collecting' );
            for ( let item in data ) {
                if ( new Date( data[ item ][ 'timestamp' ] ).getTime() + ( parseInt( this.settings.ticketTimeout ) * 1000 ) <= new Date().getTime() ) {
                    let dat = JSON.parse( data[ item ].data );
                    for ( let event in dat ) {
                        for ( let ticket in dat[ event ] ) {
                            this.temporaryTotals -= this.temporarilySelectedTotals[ data[ item ].user_id ][ event ][ ticket ];
                            delete this.temporarilySelectedTotals[ data[ item ].user_id ][ event ][ ticket ];
                            delete this.temporarilySelected[ event ][ ticket ];
                        }
                    }
                    db.deleteDataSimple( 'temp', 'entry_id', data[ item ].entry_id ).then( () => {
                        console.debug( '[ DB ] Garbage collected a session' );
                    } ).catch( err => {
                        console.error( '[ DB ] GC-ERROR: ' + err );
                    } );
                }
            }
            this.countFreeSeats();
        } );
    }

    // Add lang in the future
    handleCall ( call, data, session ) {
        return new Promise( ( resolve, reject ) => {
            if ( call === 'reserveTicket' ) {
                if ( data.count || data.count === 0 ) {
                    db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                        // const id = data.id.slice( 0, data.id.indexOf( '_' ) );
                        if ( dat[ 0 ] ) {
                            // data.count is the total amount of tickets currently selected
                            let totalTickets = 0;

                            // sum up total of tickets 
                            let info = JSON.parse( dat[ 0 ].data );
                            let tickets = info[ data.eventID ] ?? {};
                            for ( let ticket in tickets ) {
                                if ( tickets[ ticket ].count ) {
                                    totalTickets += tickets[ ticket ].count;
                                } else {
                                    totalTickets += 1;
                                }
                            }

                            // check if total ticket count exceeds max tickets per order
                            if ( this.settings.maxTickets !== 0 ) {
                                if ( totalTickets >= this.settings.maxTickets ) {
                                    reject( { 'code': 418, 'message': 'ERR_TOO_MANY_TICKETS' } );
                                    return;
                                }
                            }

                            if ( !this.temporarilySelectedTotals[ session.id ] ) {
                                this.temporarilySelectedTotals[ session.id ] = {};
                            }
                            if ( !this.temporarilySelectedTotals[ session.id ][ data.eventID ] ) {
                                this.temporarilySelectedTotals[ session.id ][ data.eventID ] = {};
                            }
                            if ( !this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] ) {
                                this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] = 0;
                            }

                            let ticketCount = data.count;
                            // check if total ticket count exceeds max tickets for this event and adjust if necessary
                            if ( this.events[ data.eventID ].maxTickets == 0 || totalTickets < this.events[ data.eventID ].maxTickets ) {
                                // check if enough tickets are still available
                                let isExceeded = false;
                                if ( ( totalTickets - ( tickets[ data.id ] ? tickets[ data.id ][ 'count' ] : 0 ) + ticketCount ) > this.ticketTotals[ data.eventID ] - ( this.temporaryTotals[ data.eventID ] ?? 0 ) + totalTickets && data.count > 0 ) {
                                    ticketCount = this.ticketTotals[ data.eventID ] - ( this.temporaryTotals[ data.eventID ] ?? 0 ) + ( tickets[ data.id ] ? tickets[ data.id ][ 'count' ] : 0 );
                                    isExceeded = true;
                                }
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
                                db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'timestamp': new Date().toString(), 'data': JSON.stringify( info ) } ).then( () => {
                                    if ( !this.temporarilySelected[ data.eventID ] ) {
                                        this.temporarilySelected[ data.eventID ] = {};
                                    }
                                    if ( !this.temporaryTotals[ data.eventID ] ) {
                                        this.temporaryTotals[ data.eventID ] = 0;
                                    }
                                    this.temporarilySelected[ data.eventID ][ data.id ] = info[ data.eventID ] ? info[ data.eventID ][ data.id ] : undefined;
                                    this.temporaryTotals[ data.eventID ] -= this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ];
                                    this.temporaryTotals[ data.eventID ] += ticketCount;
                                    this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] = ticketCount;
                                    this.countFreeSeats();
                                    if ( isExceeded ) {
                                        reject( { 'code': 409, 'message': { 'count': ticketCount } } );
                                    } else {
                                        resolve( { 'status': 'ok' } );
                                    }
                                } );
                            } else {
                                reject( { 'code': 418, 'message': { 'count': this.settings.maxTickets } } );
                            }
                        } else {                            
                            if ( !this.temporarilySelectedTotals[ session.id ] ) {
                                this.temporarilySelectedTotals[ session.id ] = {};
                            }
                            if ( !this.temporarilySelectedTotals[ session.id ][ data.eventID ] ) {
                                this.temporarilySelectedTotals[ session.id ][ data.eventID ] = {};
                            }
                            if ( !this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] ) {
                                this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] = 0;
                            }

                            let ticketCount = data.count;
                            // check if total ticket count exceeds max tickets for this event and adjust if necessary
                            if ( this.events[ data.eventID ].maxTickets == 0 || ticketCount < this.events[ data.eventID ].maxTickets ) {
                                // check if enough tickets are still available
                                let isExceeded = false;
                                if ( ticketCount > this.ticketTotals[ data.eventID ] - ( this.temporaryTotals[ data.eventID ] ?? 0 ) + this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] && data.count > 0 ) {
                                    ticketCount = this.ticketTotals[ data.eventID ] - ( this.temporaryTotals[ data.eventID ] ?? 0 ) + this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ];
                                    isExceeded = true;
                                }
                                let info = {};
                                info[ data.eventID ] = {};
                                info[ data.eventID ][ data.id ] = data;
                                db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'timestamp': new Date().toString(), 'data': JSON.stringify( info ) } ).then( () => {
                                    if ( !this.temporarilySelected[ data.eventID ] ) {
                                        this.temporarilySelected[ data.eventID ] = {};
                                    }
                                    if ( !this.temporaryTotals[ data.eventID ] ) {
                                        this.temporaryTotals[ data.eventID ] = 0;
                                    }
                                    this.temporarilySelected[ data.eventID ][ data.id ] = info[ data.eventID ] ? info[ data.eventID ][ data.id ] : undefined;
                                    this.temporaryTotals[ data.eventID ] -= this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ];
                                    this.temporaryTotals[ data.eventID ] += ticketCount;
                                    this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] = ticketCount;
                                    this.countFreeSeats();
                                    if ( isExceeded ) {
                                        reject( { 'code': 409, 'message': { 'count': ticketCount } } );
                                    } else {
                                        resolve( { 'status': 'ok' } );
                                    }
                                } );
                            } else {
                                reject( { 'code': 418, 'message': { 'count': this.settings.maxTickets } } );
                            }
                        }
                    } );
                } else {
                    if ( !this.allSelectedSeats[ data.eventID ] ) {
                        this.allSelectedSeats[ data.eventID ] = {};
                    }
                    if ( !this.temporarilySelected[ data.eventID ] ) {
                        this.temporarilySelected[ data.eventID ] = {};
                    }
                    if ( this.allSelectedSeats[ data.eventID ][ data.id ] || this.temporarilySelected[ data.eventID ][ data.id ] ) {
                        reject( { 'code': 409, 'message': 'ERR_ALREADY_SELECTED' } );
                    } else {
                        db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                            let info = {};
                            if ( dat[ 0 ] ) {
                                info = JSON.parse( dat[ 0 ].data );
                            }
                            if ( !info[ data.eventID ] ) {
                                info[ data.eventID ] = {};
                            }
                            info[ data.eventID ][ data.id ] = data;
                            db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'timestamp': new Date().toString(), 'data': JSON.stringify( info ) } ).then( () => {
                                if ( !this.temporarilySelectedTotals[ session.id ] ) {
                                    this.temporarilySelectedTotals[ session.id ] = {};
                                }
                                if ( !this.temporarilySelectedTotals[ session.id ][ data.eventID ] ) {
                                    this.temporarilySelectedTotals[ session.id ][ data.eventID ] = {};
                                }
                                if ( !this.temporaryTotals[ data.eventID ] ) {
                                    this.temporaryTotals[ data.eventID ] = 0;
                                }
                                this.temporarilySelected[ data.eventID ] = info[ data.eventID ];
                                this.temporaryTotals[ data.eventID ] += 1;
                                this.temporarilySelectedTotals[ session.id ][ data.eventID ][ data.id ] = 1;
                                this.countFreeSeats();
                                resolve( 'ok' );
                            } ).catch( err => {
                                console.error( err );
                            } );
                        } ).catch( () => {
                            console.log( '[ Ticketing ] An error occurred loading data form temp database' );
                        } );
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

                        const allSeats = this.temporarilySelected[ data.eventID ];
                        for ( let seat in allSeats ) {
                            if ( allSeats[ seat ].component === data.component ) {
                                if ( allSeats[ seat ].id === data.id ) {
                                    this.temporaryTotals[ data.eventID ] -= 1;
                                    delete this.temporarilySelectedTotals[ session.id ][ data.eventID ][ seat ];
                                    delete this.temporarilySelected[ data.eventID ][ seat ];
                                }
                            }
                        }
                    } else {
                        reject( { 'code': 404, 'message': 'ERR_DATA_NOT_FOUND' } );
                        return;
                    }                    

                    db.writeDataSimple( 'temp', 'user_id', session.id, { 'user_id': session.id, 'data': JSON.stringify( transmit ) } ).then( () => {
                        this.countFreeSeats();
                        resolve( 'ok' );
                    } ).catch( error => {
                        console.error( error );
                        reject( { 'code': 500, 'message': 'ERR_DB' } );
                    } );
                } ).catch( error => {
                    console.error( error );
                    reject( { 'code': 500, 'message': 'ERR_DB' } );
                } );
            } else if ( call === 'resetPW' ) {
                pwHandler.resetPassword( data.email ).then( () => {
                    resolve( 'ok' );
                } ).catch( error => {
                    if ( error.code ) {
                        reject( error );
                    } else {
                        reject( { 'code': 500, 'message': error } );
                    }
                } );
            } else {
                reject( { 'code': 404, 'message': 'Route not found' } );
            }
        } );
    }

    getReservedSeats ( event ) {
        return this.allSelectedSeats[ event ] ? Object.values( Object.assign( {}, this.allSelectedSeats[ event ], this.temporarilySelected[ event ] ) ) : ( this.temporarilySelected[ event ] ?? {} );
    }

    countFreeSeats() {
        this.freeSeats = {};
        for ( let el in this.ticketTotals ) {
            this.freeSeats[ el ] = this.ticketTotals[ el ];
        }
        for ( let el in this.temporaryTotals ) {
            this.freeSeats[ el ] -= this.temporaryTotals[ el ];
        }
        this.ticketTotals[ 'test3' ] = 2;
    }

    getFreeSeatsCount() {
        return this.freeSeats;
    }
}

module.exports = POSTHandler;