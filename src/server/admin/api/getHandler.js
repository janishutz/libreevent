/*
*				libreevent - getHandler.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( '../../backend/db/db.js' );

class GETHandler {
    constructor ( settings ) {
        this.settings = settings;
    }

    handleCall ( call, query ) {
        return new Promise( ( resolve, reject ) => {
            if ( call === 'getSeatplan' ) {
                db.getJSONDataSimple( 'seatplan', query.location ).then( data => {
                    if ( Object.keys( data ).length > 0 ) {
                        resolve( data[ 'save' ] );
                    } else {
                        reject( { 'code': 400, 'error': 'No data found for this location' } );
                    }
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'getSeatplanDraft' ) {
                db.getJSONDataSimple( 'seatplan', query.location ).then( data => {
                    if ( Object.keys( data ).length > 0 ) {
                        if ( Object.keys( data[ 'draft' ] ).length > 0 ) {
                            resolve( data[ 'draft' ] );
                        } else {
                            resolve( data[ 'save' ] );
                        }
                    } else {
                        reject( { 'code': 400, 'error': 'No data found for this location' } );
                    }
                } ).catch( error => {
                    reject( error );
                } );
            } else if ( call === 'getLocations' ) {
                db.getJSONData( 'locations' ).then( data => {
                    resolve( data ?? {} );
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'getTicketTemplate' ) {
                db.getJSONDataSimple( 'tickets', query.ticket ).then( data => {
                    resolve( data ?? {} );
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'getEvent' ) {
                db.getJSONDataSimple( 'eventDrafts', query.event ).then( data => {
                    if ( Object.keys( data ).length > 1 ) {
                        resolve( data );
                    } else {
                        reject( { 'code': 404, 'error': 'EventNotFound' } );
                    }
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'getAllEvents' ) {
                db.getJSONData( 'eventDrafts' ).then( data => {
                    db.getJSONData( 'events' ).then( dat => {
                        resolve( { 'live': dat ?? {}, 'drafts': data ?? {} } );
                    } ).catch( error => {
                        reject( { 'code': 500, 'error': error } );
                    } );
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'getCurrency' ) {
                resolve( this.settings.currency );
            } else if ( call === 'getAdminAccounts' ) {
                // TODO: Finish
            } else if ( call === 'getPaymentGatewaySettings' ) {
                // TODO: Finish
            } else if ( call === 'getSettings' ) {
                resolve( this.settings );
            } else {
                reject( { 'code': 404, 'error': 'Route not found' } );
            }
        } );
    }
}

module.exports = GETHandler;