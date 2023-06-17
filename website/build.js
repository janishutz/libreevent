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
    let allFiles = [];

    let directoriesToScan = [];
    let files = fs.readdirSync( path.join( __dirname + '/src/' ) );
    for ( let file in files ) {
        if ( files[ file ].substring( files[ file ].length - 3 ) == '.md' ) {
            allFiles.push( handleMD( path.join( __dirname + '/src/' + files[ file ] ) ) );
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
                    allFiles.push( handleMD( path.join( __dirname + '/src/' + directoriesToScan[ missing ] + '/' + files[ file ] ) ) );
                } else {
                    directoriesToScan.push( directoriesToScan[ missing ] + '/' + files[ file ] );
                    count += 1;
                }
            }
        }
    }
    return allFiles;
}

function handleMD ( filepath ) {
    let fileContent = md2html.render( fs.readFileSync( filepath ).toString() );
    for ( let letter in fileContent ) {
        if ( fileContent[ letter ] == '<' ) {
            if ( fileContent.slice( parseInt( letter ), parseInt( letter ) + 9 ) === '<a href="' ) {
                let newLink = '';
                let i = 9;
                while ( fileContent.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '"' ) {
                    i += 1;
                }
                let link = fileContent.slice( parseInt( letter ) + 9, parseInt( letter ) + i  );
                if ( link.slice( 0, 1 ) === '/' || link.slice( 0, 8 ) === 'https://' || link.slice( 0, 7 ) === 'http://' || link.slice( 0, 1 ) !== '/' && link.slice( 0, 1 ) !== '&' ) {
                    newLink = '<a href="' + link + '">';
                } else if ( link.slice( 0, 2 ) == '&/' ) {
                    newLink = '<a href="/docs/' + link.substring( 2 ) + '">';
                } else if ( link.slice( 0, 6 ) == '&amp;/' ) {
                    newLink = '<a href="/docs/' + link.substring( 6 ) + '">';
                } else if ( link.slice( 0, 2 ) == '//' ) {
                    if ( link.includes( '.' ) ) {
                        newLink = '<a href="https://github.com/simplePCBuilding/libreevent/blob/master/' + link.substring( 2 ) + '">';
                    } else {
                        newLink = '<a href="https://github.com/simplePCBuilding/libreevent/tree/master/' + link.substring( 2 ) + '">';
                    }
                }  else {
                    console.error( 'Unsupported link: ' + link );
                    throw 'INVALID LINK FOUND IN PLUGINS README! Please fix and rerun the script';
                }
                fileContent = fileContent.slice( 0, parseInt( letter ) ) + newLink + fileContent.slice( parseInt( letter ) + i + 2, parseInt( fileContent.length ) );
            }
        }
    }
    return storeHTML( fileContent, filepath );
}

function storeHTML( html, filepath ) {
    /* 
        TODO: Guess doc page title from first H1 Element.
    */
    let data = `<!DOCTYPE html>
    <html>
        <head>
        <title>${ filepath } :: DOCS - libreevent</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="/js/docs/loader.js"></script>
        <link rel="stylesheet" href="/css/docs/style.css">
        </head>
        <body>
            <div class="content">
                <div id="nav"></div>
                <div id="top"></div>
                    <div id="docPage">
                        <div id="doc-container">
                        ${ html }</div>
                    </div>
                <div id="footer"></div>
            </div>
        </body>
    </html>`;

    /* 
        Transform file path into correct file structure and output file to dist/docs folder
    */
    let fileOutputPath = path.join( __dirname + '/dist/docs' );
    let pos = filepath.indexOf( 'src' );
    fileOutputPath += filepath.substring( parseInt( pos ) + 3, filepath.length - 3 );
    try {
        fs.mkdirSync( fileOutputPath, { recursive: true } );
    } catch ( error ) {
        null;
    }
    fileOutputPath += '/index.html';
    fs.writeFileSync( fileOutputPath, data );
    return fileOutputPath;
}