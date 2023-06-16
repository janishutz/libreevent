/*
*				libreevent - build.js
*
*	Created by Janis Hutz 03/09/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const markdownIt = require( 'markdown-it' );
const md2html = new markdownIt();
const fs = require( 'fs' );
const path = require( 'path' );

buildNav( buildDocs() );

function buildNav ( pathObject ) {
    console.log( 'building nav ' + pathObject );
}

function buildDocs () {
    let directoriesToScan = [];
    let files = fs.readdirSync( path.join( __dirname + '/src/' ) );
    for ( let file in files ) {
        if ( files[ file ].substring( files[ file ].length - 3 ) == '.md' ) {
            handleMD( files[ file ] );
        } else {
            directoriesToScan.push( files[ file ] );
        }
    }

    let count = directoriesToScan.length;

    while ( count > 0 ) {
        for ( let missing in directoriesToScan ) {
            let files = fs.readdirSync( path.join( __dirname + '/src/' + directoriesToScan[ missing ] ) );
            count -= 1;
            for ( let file in files ) {
                if ( files[ file ].substring( files[ file ].length - 3 ) == '.md' ) {
                    handleMD( files[ file ] );
                } else {
                    directoriesToScan.push( directoriesToScan[ missing ] + '/' + files[ file ] );
                    count += 1;
                }
            }
        }
    }
    md2html.render( '#Test' );
    return 'Hi';
}

function handleMD ( path ) {
    console.log( 'md file', path );
}