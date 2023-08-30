/*
*				libreevent - getHandler.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( '../../backend/db/db.js' );
const pm = require( '../../backend/plugins/manager.js' );

class GETHandler {
    constructor ( settings ) {
        this.pluginManager = new pm( settings );
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
            } else if ( call === 'getEventStatus' ) {
                db.getJSONDataSimple( 'events', query.event ).then( data => {
                    if ( Object.keys( data ) ) {
                        resolve( true );
                    } else {
                        resolve( false );
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
                db.getData( 'admin' ).then( data => {
                    resolve( data );
                } ).catch( err => {
                    reject( { 'code': 500, 'message': 'ERR_DB: ' + err } );
                } );
            } else if ( call === 'getPaymentGatewaySettings' ) {
                this.pluginManager.loadPaymentGatewaySettings().then( dat => {
                    resolve( dat );
                } ).catch( err => {
                    reject( { 'code': 500, 'error': err } );
                } );
            } else if ( call === 'getSettings' ) {
                resolve( this.settings );
            } else if ( call === 'getAllPlugins' ) {
                resolve( this.pluginManager.getPlugins() );
            } else {
                reject( { 'code': 404, 'error': 'Route not found' } );
            }
        } );
    }
}

module.exports = GETHandler;