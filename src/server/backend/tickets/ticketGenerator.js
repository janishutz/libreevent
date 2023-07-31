/*
*				libreevent - ticketGenerator.js
*
*	Created by Janis Hutz 07/25/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/


const pdfme = require( '@pdfme/generator' );
const db = require( '../db/db.js' );

class TicketGenerator {
    constructor () {
        this.ticketQueue = {};
    }

    generateTicket ( data ) {

    }

    ticketGenerator ( event, data ) {
        return new Promise( ( resolve, reject ) => {
            db.getJSONDataSimple( event ).then( template => {
                pdfme.generate( { template, data } ).then( pdf => {
                    resolve( pdf );
                    // TODO: Maybe write to disk
                } ).catch( error => {
                    reject( error );
                } );
            } );
        } );
    }
}

module.exports = TicketGenerator;