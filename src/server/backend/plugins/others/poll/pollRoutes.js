/*
*				libreevent - pollRoutes.js
*
*	Created by Janis Hutz 08/13/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const fs = require( 'fs' );
const bodyParser = require( 'body-parser' );

// Memory caching system to prevent downtime
// This is basically the same system as can be found in the JSON db's saving system
let votingMemCache = JSON.parse( fs.readFileSync( path.join( __dirname + '/data/voting.json' ) ) );
let hasToSave = false;
let isReadyToSave = true;

const saveVotingData = () => {
    if ( isReadyToSave ) {
        isReadyToSave = false;
        hasToSave = false;
        runSave();
    } else {
        hasToSave = true;
    }
};

const runSave = () => {
    fs.writeFile( path.join( __dirname + '/data/voting.json' ), JSON.stringify( votingMemCache ), ( err ) => {
        if ( err ) { 
            console.error( err ); 
        } else {
            isReadyToSave = true;
            if ( hasToSave ) {
                runSave();
            }
        }
    } );
};

module.exports = ( app ) => {
    app.get( '/polls/:vote', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/html/voting.html' ) );
    } );

    app.get( '/polls/css/:file', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/css/' + req.params.file ) );
    } );

    app.get( '/polls/js/:file', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/js/' + req.params.file ) );
    } );
    
    app.get( '/polls/getDetails/:vote', ( req, res ) => {
        fs.readFile( path.join( __dirname + '/data/votingSettings.json' ), ( error, filedata ) => {
            res.send( JSON.parse( filedata )[ req.params.vote ] ?? {} );
        } );
    } );
    
    app.get( '/polls/get/:vote', ( req, res ) => {
        res.send( votingMemCache[ req.params.vote ] );
    } );
    
    app.post( '/polls/vote/:vote/', bodyParser.json(), ( req, res ) => {
        // up / down-voting
        if ( votingMemCache[ req.params.vote ] ) {
            if ( votingMemCache[ req.params.vote ][ req.body.id ] ) {
                if ( req.body.voteType === 'up' ) {
                    votingMemCache[ req.params.vote ][ req.body.id ].count += 1;
                } else if ( req.body.voteType === 'down' ) {
                    votingMemCache[ req.params.vote ][ req.body.id ].count -= 1;
                }
                saveVotingData();
                res.send( 'ok' );
            } else {
                res.status( 404 ).send( 'No Entry on this vote with' );
            }
        } else {
            res.status( 404 ).send( 'No Vote with this ID' );
        }
    } );
    
    app.post( '/polls/add/:vote', bodyParser.json(), ( req, res ) => {
        let data = req.body;
        if ( data.title && data.comment ) {
            if ( !votingMemCache[ req.params.vote ] ) {
                votingMemCache[ req.params.vote ] = {};
            }
            const id = parseInt( Object.keys( votingMemCache[ req.params.vote ] )[ Object.keys( votingMemCache[ req.params.vote ] ).length - 1 ] ?? 0 ) + 1;
            votingMemCache[ req.params.vote ][ id ] = data;
            votingMemCache[ req.params.vote ][ id ][ 'id' ] = id;
            votingMemCache[ req.params.vote ][ id ][ 'count' ] = 1;
            res.send( 'ok' );
        } else {
            res.status( 400 ).send( 'incomplete' );
        }
    } );

    app.get( '/admin/plugins/polls', ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            res.sendFile( path.join( __dirname + '/html/settings.html' ) );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.get( '/admin/plugins/polls/getData', ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            res.sendFile( path.join( __dirname + '/data/votingSettings.json' ) );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );

    app.post( '/admin/plugins/polls/save', bodyParser.json(), ( req, res ) => {
        if ( req.session.loggedInAdmin ) {
            fs.writeFileSync( path.join( __dirname + '/data/votingSettings.json' ), JSON.stringify( req.body ) );
            res.send( 'ok' );
        } else {
            res.status( 403 ).send( 'unauthorized' );
        }
    } );
};