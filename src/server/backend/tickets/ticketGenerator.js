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
        this.jobId = 0;
        this.isRunning = false;
    }

    // TODO: Save to disk in case of crash of server / reboot / whatever
    // and continue processing once back online
    generateTicket ( event, data ) {
        this.ticketQueue [ this.jobId ] = { 'event': event, 'data': data };
        this.jobId += 1;
        this.queueHandler();
    }

    // TODO: Maybe move to subprocesses
    queueHandler () {
        if ( !this.isRunning ) {
            this.isRunning = true;
            this.ticketGenerator( this.ticketQueue[ this.jobId ][ 'event' ], this.ticketQueue[ this.jobId ][ 'data' ] ).then( pdf => {
                console.log( pdf );
                // TODO: Maybe write to disk
                this.isRunning = false;
                this.queueHandler();
            } ).catch( error => {
                console.error( '[ PDF GENERATOR ] ERROR: ' + error );
                this.isRunning = false;
                this.queueHandler();
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