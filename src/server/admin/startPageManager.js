/*
*				libreevent - startPageManager.js
*
*	Created by Janis Hutz 09/04/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

let createSSRApp = require( 'vue' ).createSSRApp;
let renderToString = require( 'vue/server-renderer' ).renderToString;
const fs = require( 'fs' );
const path = require( 'path' );

class StartPageManager {
    constructor ( settings ) {
        this.settings = settings;
    }

    saveStartPagePreferences( startPageName, preferences ) {
        fs.writeFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/startPage.config.html' ), JSON.stringify( preferences ) );
    }

    loadStartPagePreferences( startPageName ) {
        return JSON.parse( fs.readFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/startPage.config.html' ) ) );
    }

    findAllStartPageTemplates() {
        return fs.readdirSync( path.join( __dirname + '/../ui/home/templates/' ) );
    }

    setActiveStartPage( startPageName ) {
        this.settings[ 'startPage' ] = startPageName;
        fs.writeFileSync( path.join( __dirname + '/../config/settings.config.json' ), JSON.stringify( this.settings ) );
    }

    async renderStartPage( startPageName ) {
        this.setActiveStartPage( startPageName );
        const app = createSSRApp( {
            data() {
                return this.loadStartPagePreferences( startPageName );
            },
            template: '' + fs.readFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/index.html' ) )
        } );

        fs.writeFileSync( path.join( __dirname + '/../ui/home/active/en/index.html' ), await renderToString( app ) );
    }
}

module.exports = StartPageManager;