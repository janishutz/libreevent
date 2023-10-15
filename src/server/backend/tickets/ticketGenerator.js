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
        db.getData( 'orders' ).then( orders => {
            for ( let order in orders ) {
                if ( orders[ order ][ 'processed' ] != 'true' ) {
                    this.ticketQueue[ this.jobId ] = { 'order': orders[ order ][ 'order_name' ] };
                    this.jobId += 1;
                }
            }
            if ( this.jobId > 0 ) {
                this.queueHandler();
            }
        } );
    }

    sendErrorMail( order, email ) {
        db.getJSONData( 'rootAccount' ).then( res => {
            ( async() => {
                const app = createSSRApp( {
                    data() {
                        return {
                            host: settings.yourDomain,
                            pageName: settings.name,
                        };
                    },
                    template: '' + fs.readFileSync( path.join( __dirname + '/../../ui/en/payments/failedToProcessMail.html' ) )
                } );
                
                mailManager.sendMail( email, await renderToString( app ), 'Your order failed to process', settings.mailSender );

                const adminNot = createSSRApp( {
                    data() {
                        return {
                            host: settings.yourDomain,
                            email: email,
                            order_id: order,
                        };
                    },
                    template: '' + fs.readFileSync( path.join( __dirname + '/../../ui/en/payments/failedToProcessDetailsMail.html' ) )
                } );

                mailManager.sendMail( res.email, await renderToString( adminNot ), 'Your order failed to process', settings.mailSender );
            } )();
        } );
    }

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

    // TODO: FUTURE: move to subprocesses
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
                            const template = this.tickets[ event ] ?? {
                                basePdf: 'data:application/pdf;base64,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LTEuNDAuMjUgKFRlWCBMaXZlIDIwMjMvQXJjaCBMaW51eCkga3BhdGhzZWEgdmVyc2lvbiA2LjMuNSkKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL09ialN0bQovTiAxMAovRmlyc3QgNjIKL0xlbmd0aCA2MzEgICAgICAgCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp42o1UTW/bMAy9+1fwuGGoKVm2bANBsCZd2q3rUCTZ1iHIQXU0x1hqB7ZStP9+pGw0aXfZwYL0+Pj4YUoJCIgh1yAhEvRBpCQoWgkREKUxyAh0qiCFXOaQE6olSIKlUMFoFODyeW8Bb01pA5w2tbO160CT7DzAue2aQ1vYjmJ44MZuKjNpnmAlCEjyJIxSDVkswyxfB6TSkjtFYfJ4zPpAorumXexNYSkxMnAw52xbU7b++OnJXS6ccZaKYCDAGeUBoxHgTHHmDJIa3rZNsbAOViRxMQNc2icH6z4Q4L78/bEwMhTeszDA2/HYW3uK5+zb8h5WLznghX2sCju/nKw5xkopFVL/0jTMIBHiv7/e43RN/RqnURgNa4+kiYBUZBQljTyqVZiDzkSoQScRM7I4TD1PaRlKSCQzem8dJfQn9WAfMO87qCvNHknCSK/PPPqkiF7C06clSx8Lfbs7aYEXi+M4jF/tleD9kdF7DGh01Mh8S3vOkd0zVC6pFJV7vSyjMk+s65MB5ZG4sF3RVnvXtP2IfDMPZPlydTe9vP4wvZlLQfjOlDSuPWHiR/UsFnAW+Q6InGunST3vCp5UnRNzavZXtiq3dMxUgByFbWeSjZ+d2VXFeV3uLJD8wtmHH+QW4N3gEytJElvT8mS+wyX+QoP3WKDFErfP+62tscI/uMMHrLHBprbYYocOD/j4vs9zVpG6lCfX5qRqCnq4d/7IIEWbmM76K/K29lc94pvvL+2sajvHGUKcBPjVDAcpswB/Vhu37fit8NRl872uimZD2ah/s+FHouNX4kCxKY/ratPBKmHi+jVzaqhtTRn0LscH4S82riOxCmVuZHN0cmVhbQplbmRvYmoKMTYgMCBvYmoKPDwKL1R5cGUgL1hSZWYKL0luZGV4IFswIDE3XQovU2l6ZSAxNwovVyBbMSAyIDFdCi9Sb290IDE0IDAgUgovSW5mbyAxNSAwIFIKL0lEIFs8QThGQURBNEJENDA3NjdFMzY5MDY3MDI0NjNBQTI5N0E+IDxBOEZBREE0QkQ0MDc2N0UzNjkwNjcwMjQ2M0FBMjk3QT5dCi9MZW5ndGggNjAgICAgICAgIAovRmlsdGVyIC9GbGF0ZURlY29kZQo+PgpzdHJlYW0KeNpjYGD4z8TAwQTEzEDMAsSMQMzAyMDPAKTZGS3aQDQHELMyMmmC2GyMJs4gmpPRvIyB0TqLAQCCZgRYCmVuZHN0cmVhbQplbmRvYmoKc3RhcnR4cmVmCjE1MjEwCiUlRU9GCg==',
                                schemas: [
                                    {
                                        'locationAndTime': {
                                            'type': 'text',
                                            'position': {'x': 90,'y': 70},
                                            'width': 85,
                                            'height': 10,
                                            'fontName': 'Roboto'
                                        },'eventName': {
                                            'type': 'text',
                                            'position': {'x': 89.7,'y': 30},
                                            'width': 85,
                                            'height': 15,
                                            'alignment': 'left',
                                            'fontSize': 18,
                                            'characterSpacing': 0,
                                            'lineHeight': 1,
                                            'fontName': 'Roboto'
                                        }, 'ticketName': {
                                            'type': 'text',
                                            'position': {'x': 90,'y': 55},
                                            'width': 85,
                                            'height': 10,
                                            'fontName': 'Roboto',
                                            'alignment': 'left'
                                        }, 'ticketQRCode': {
                                            'type': 'qrcode',
                                            'position': {'x': 25,'y': 30.05},
                                            'width': 50,
                                            'height': 50
                                        }
                                    }
                                ],
                                'columns': [
                                    'locationAndTime',
                                    'eventName',
                                    'ticketName',
                                    'ticketQRCode'
                                ],
                                'sampledata': [
                                    {
                                        'locationAndTime': 'Time and date of event',
                                        'eventName': 'Your Event name will be filled in automatically',
                                        'ticketName': 'Ticket details go here (Ticket name)',
                                        'ticketQRCode': 'QR-Code for entry control will appear here'
                                    }
                                ],
                            };
                            for ( let ticket in order[ event ] ) {
                                for ( let tik = 0; tik < ( order[ event ][ ticket ].count ?? 1 ); tik++ ) {
                                    const data = [ { 
                                        'eventName': this.events[ event ][ 'name' ],
                                        'locationAndTime': new Date( this.events[ event ][ 'date' ] ).toLocaleString(),
                                        'ticketName': order[ event ][ ticket ][ 'name' ], 
                                        'ticketQRCode': ord[ 0 ].order_name + '_' + event + '-' + order[ event ][ ticket ][ 'id' ],
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