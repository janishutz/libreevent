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
const pdfLib = require( 'pdf-lib' );
const fs = require( 'fs' );
const path = require( 'path' );
const mm = require( '../mail/mailSender.js' );
const mailManager = new mm();
let createSSRApp = require( 'vue' ).createSSRApp;
let renderToString = require( 'vue/server-renderer' ).renderToString;

const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../config/settings.config.json' ) ) );

class TicketGenerator {
    constructor () {
        this.ticketQueue = {};
        this.jobId = 0;
        this.currentlyRunningJob = 0;
        this.isRunning = false;
        db.getJSONData( 'tickets' ).then( tickets => {
            this.tickets = tickets;
        } );
        db.getJSONData( 'events' ).then( events => {
            this.events = events;
        } );
        this.runningTickets = {};
    }

    // TODO: continue processing once back online
    generateTickets ( order ) {
        this.ticketQueue[ this.jobId ] = { 'order': order };
        this.runningTickets[ order.tok ] = 'processing';
        this.jobId += 1;
        this.queueHandler();
    }

    getGenerationStatus ( order ) {
        if ( this.runningTickets[ order ] ) {
            if ( this.runningTickets[ order ] === 'done' ) {
                delete this.runningTickets[ order ];
                return 'done';
            } else {
                return 'processing';
            }
        } else {
            return 'noTicket';
        }
    }

    // TODO: Maybe move to subprocesses
    queueHandler () {
        if ( !this.isRunning ) {
            this.isRunning = true;
            if ( this.ticketQueue[ this.currentlyRunningJob ] ) {
                this.ticketGenerator( this.ticketQueue[ this.currentlyRunningJob ][ 'order' ] ).then( res => {
                    this.currentlyRunningJob += 1;
                    if ( res.status ) {
                        db.getDataSimple( 'users', 'account_id', res.user ).then( dat => {
                            if ( dat[ 0 ] ) {
                                ( async () => {
                                    const app = createSSRApp( {
                                        data() {
                                            return {
                                                host: settings.yourDomain,
                                                pageName: settings.name,
                                            };
                                        },
                                        template: '' + fs.readFileSync( path.join( __dirname + '/../../ui/en/payments/ticketMail.html' ) )
                                    } );
                                    
                                    this.runningTickets[ res.order ] = 'done';
                                    
                                    mailManager.sendMailWithAttachment( dat[ 0 ].email, await renderToString( app ), 'Thank you for your order', [
                                        {
                                            'filename': 'tickets.pdf',
                                            'path': res.file,
                                        }
                                    ], settings.mailSender
                                    );
                                    db.writeDataSimple( 'orders', 'order_name', res.order, { 'processed': 'true' } );
                                } )();
                            }
                        } );
                    }
                    this.isRunning = false;
                    this.queueHandler();
                } ).catch( error => {
                    console.error( '[ PDF GENERATOR ] ERROR: ' + error );
                    this.isRunning = false;
                    // TODO: Add to FAILED db
                } );
            }
        }
    }

    ticketGenerator ( order ) {
        return new Promise( ( resolve, reject ) => {
            db.getDataSimple( 'orders', 'order_name', order.tok ).then( ord => {
                if ( ord[ 0 ] ) {
                    ( async () => {
                        let doc = await pdfLib.PDFDocument.create();
                        let pages = [];
                        const order = JSON.parse( ord[ 0 ].tickets );
                        for ( let event in order ) {
                            const template = this.tickets[ event ];
                            for ( let ticket in order[ event ] ) {
                                for ( let tik = 0; tik < ( order[ event ][ ticket ].count ?? 1 ); tik++ ) {
                                    const data = [ { 
                                        'eventName': this.events[ event ][ 'name' ],
                                        'locationAndTime': new Date( this.events[ event ][ 'date' ] ).toLocaleString(),
                                        'ticketName': order[ event ][ ticket ][ 'name' ], 
                                        'ticketQRCode': ord[ 0 ].order_name + '_' + order[ event ][ ticket ][ 'id' ],
                                    } ];
                                    const page = await pdfLib.PDFDocument.load( await pdfme.generate( { 'template': template, 'inputs': data } ) );
                                    const p = await doc.copyPages( page, page.getPageIndices() );
                                    pages.push( p );
                                    p.forEach( ( page ) => doc.addPage( page ) );
                                }
                            }
                        }
                        const f = path.join( __dirname + '/store/' + ord[ 0 ].order_name + '.pdf' );
                        fs.writeFileSync( f, await doc.save() );
                        resolve( { 'status': true, 'file': f, 'user': ord[ 0 ].account_id, 'order': ord[ 0 ].order_name } );
                    } )();
                } else {
                    reject( 'ERR_NO_ORDER' );
                }
            } ).catch( err => {
                console.error( err );
            } );
        } );
    }
}

module.exports = TicketGenerator;