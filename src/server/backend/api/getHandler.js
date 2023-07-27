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

    handleCall ( call, query, session ) {
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
                    db.getJSONDataSimple( 'booked', query.event ).then( data => {
                        console.log( session.id );
                        db.getDataSimple( 'temp', 'user_id', session.id ).then( dat => {
                            console.log( dat );
                            resolve( { 'booked': data ? data.booked : {}, 'user': dat[ 0 ] ? JSON.parse( dat[ 0 ].data )[ query.event ] ?? {} : {} } );
                        } );
                    } ).catch( error => {
                        reject( { 'code': 500, 'message': error } );
                    } );
                } else {
                    reject( { 'code': 400, 'message': 'Bad request, missing event query' } );
                }
            }
        } );
    }
}

module.exports = GETHandler;