/*
*				libreevent - getHandler.js
*
*	Created by Janis Hutz 07/20/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const db = require( '../db/db.js' );

class GETHandler {
    constructor () {

    }

    handleCall ( call, query, session, settings ) {
        return new Promise( ( resolve, reject ) => {
            if ( call === 'getSeatplan' ) {
                db.getJSONDataSimple( 'seatplan', query.location ).then( data => {
                    if ( Object.keys( data ).length > 0 ) {
                        resolve( data[ 'save' ] );
                    } else {
                        reject( { 'code': 404, 'message': 'No data found for this location' } );
                    }
                } ).catch( error => {
                    reject( { 'code': 500, 'message': error } );
                } );
            } else if ( call === 'getReservedSeats' ) {
                if ( query.event ) {
                    db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                        resolve( { 'user': dat[ 0 ] ? JSON.parse( dat[ 0 ].data )[ query.event ] ?? {} : {} } );
                    } ).catch( () => {
                        reject( { 'code': 500, 'message': 'ERR_DB' } );
                    } );
                } else {
                    reject( { 'code': 400, 'message': 'Bad request, missing event query' } );
                }
            } else if ( call === 'getEvent' ) {
                db.getJSONDataSimple( 'events', query.event ).then( data => {
                    if ( Object.keys( data ) ) {
                        resolve( data );
                    } else {
                        reject( { 'code': 404, 'error': 'EventNotFound' } );
                    }
                } ).catch( error => {
                    reject( { 'code': 500, 'error': error } );
                } );
            } else if ( call === 'getName' ) {
                resolve( { 'name': settings.name } );
            } else {
                reject( { 'code': 404, 'message': 'Route not found' } );
            }
        } );
    }
}

module.exports = GETHandler;