const express = require( 'express' );
let app = express();
const http = require( 'http' );

app.use( express.static( '.' ) );


const PORT = process.env.PORT || 8081;
http.createServer( app ).listen( PORT );