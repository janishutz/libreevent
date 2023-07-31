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
        this.isRunning = false;
    }

    generateTicket ( event, data ) {
        
    }

    // TODO: Maybe move to subprocesses
    queueHandler () {
        if ( !this.isRunning ) {
            this.isRunning = true;
            this.ticketGenerator( this.ticketQueue[ Object.keys( this.ticketQueue )[ 0 ] ] ).then( res => {
                // TODO: Maybe write to disk
                this.isRunning = false;
            } ).catch( error => {
                this.isRunning = false;
                // TODO: Add to FAILED db
            } );
        }
    }

    ticketGenerator ( event, data ) {
        return new Promise( ( resolve, reject ) => {
            db.getJSONDataSimple( event ).then( template => {
                pdfme.generate( { template, data } ).then( pdf => {
                    resolve( pdf );
                } ).catch( error => {
                    reject( error );
                } );
            } );
        } );
    }
}

module.exports = TicketGenerator;