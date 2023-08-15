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

console.log( `

_ _ _                                   _   
| (_) |                                 | |  
| |_| |__  _ __ ___  _____   _____ _ __ | |_ 
| | | '_ \\| '__/ _ \\/ _ \\ \\ / / _ \\ '_ \\| __|
| | | |_) | | |  __/  __/\\ V /  __/ | | | |_ 
|_|_|_.__/|_|  \\___|\\___| \\_/ \\___|_| |_|\\__|

-------------------------------------------------------

    ==> Building the libreevent documentation!
                                             
` );

buildNav( buildDocs() );


function buildNav ( pathObject ) {
    let html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <link rel="stylesheet" href="/docs/css/navstyle.css">
        </head>
        <body>
            <div class="side-nav-container">
                <div class="side-nav-wrapper">
                    <div class="side-nav-list">
                    <a class="side-nav-item" id="docs-home" href="/docs">Home</a>`;
    let groups = {};
    for ( let item in pathObject ) {
        if ( groups[ pathObject[ item ][ 'group' ] ] ) {
            groups[ pathObject[ item ][ 'group' ] ].push( pathObject[ item ] );
        } else {
            groups[ pathObject[ item ][ 'group' ] ] = [ pathObject[ item ] ];
        }
    }

    for ( let group in groups ) {
        if ( Object.keys( groups[ group ] ).length > 1 ) {
            html += `<a class="side-nav-item" id="${ group }Nav" onclick="toggleList( '${ group }' );">${ group.slice( 0, 1 ).toUpperCase() + group.substring( 1 ) }</a>
<div class="side-dropdown" id="${ group }-dropdown">\n`;
            for ( let entry in groups[ group ] ) {
                html += `<a class="side-nav-subitem" id="${ groups[ group ][ entry ][ 'id' ] }" href="${ groups[ group ][ entry ][ 'filePath' ] }">${ groups[ group ][ entry ][ 'title' ] }</a>\n`;
            }
            html += '</div>\n';
        } else {
            html += `<a class="side-nav-item" id="${ groups[ group ][ 0 ][ 'id' ] }" href="${ groups[ group ][ 0 ][ 'filePath' ] }">${ groups[ group ][ 0 ][ 'title' ] }</a>\n`;
        }
    }

    html += `</div>
                </div>
            </div>
        <script src="/docs/js/nav.js"></script>
    </body>
</html>`;

    fs.writeFileSync( path.join( __dirname + '/dist/docs/side-bar.html' ), html );

    console.log( '  ==> Successfully built documentation! \n\n' );
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

function guessTitle( html ) {
    return html.substring( parseInt( html.indexOf( '<h1>' ) ) + 4, html.indexOf( '</h1>' ) );
}

function storeHTML( html, filepath ) {
    let title = guessTitle( html );
    let data = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>${ title } :: docs - libreevent</title>
            <link rel="stylesheet" href="/docs/css/style.css">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta charset="utf-8">
            <meta name="description" content="Looking for a free and open source event management solution you can host yourself? libreevent is a project that does exactly that.">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/dark.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
            <script>hljs.highlightAll();</script>
        </head>
        <body>
            <div id="nav"></div>
            <div id="side-bar"></div>
            <div id="backToTop" onclick="backToTop();"></div>
            <div id="docPage">
                <div id="doc-container">
                ${ html }</div>
            </div>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
            <script src="/docs/js/index.js"></script>
        </body>
    </html>`;

    /* 
        Transform file path into correct file structure and output file to dist/docs folder
    */
    let fileOutputPath = path.join( __dirname + '/dist/docs' );
    let pos = filepath.indexOf( 'src' );
    let category = filepath.substring( parseInt( pos ) + 4, filepath.length - 3 );
    fileOutputPath += '/' + category;
    let group = '';
    if ( category.lastIndexOf( '/' ) >= 0 ) {
        group = category.slice( 0, category.lastIndexOf( '/' ) );
    } else {
        group = category;
    }
    try {
        fs.mkdirSync( fileOutputPath, { recursive: true } );
    } catch ( error ) {
        null;
    }
    fileOutputPath += '/index.html';
    fs.writeFileSync( fileOutputPath, data );
    let id = '';
    for ( let letter in category ) {
        if ( category[ letter ] == '/' ) {
            id += '-';
        } else {
            id += category[ letter ];
        }
    }
    return { 'filePath': '/docs/' + category, 'title': title, 'group': group, 'id': id };
}