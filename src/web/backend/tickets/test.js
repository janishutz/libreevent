/*
*				libreevent - test.js
*
*	Created by Janis Hutz 08/06/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const express = require( 'express' );
let app = express();
const ticket = require( './ticketGenerator.js' );
const TicketGenerator = new ticket();
const http = require( 'http' );


app.get( '/', ( request, response ) => {
    response.send( 'ok' );
    TicketGenerator.generateTickets( { 'tok': 'hGids5PVsHm_KiK-Wd-8ekvwxpuUPrUX', 'email': 'info@janishutz.com' } );
} );


const PORT = process.env.PORT || 8080;
http.createServer( app ).listen( PORT );