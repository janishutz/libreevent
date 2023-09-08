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
const db = require( '../backend/db/db.js' );

class StartPageManager {
    constructor ( settings ) {
        this.settings = settings;
    }

    saveStartPagePreferences( startPageName, preferences ) {
        let conf = {};
        for ( let setting in preferences ) {
            conf[ setting ] = preferences[ setting ][ 'value' ];
        }
        fs.writeFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/startPage.config.json' ), JSON.stringify( conf ) );
    }

    loadStartPagePreferences( startPageName ) {
        let conf, options;
        try {
            options = JSON.parse( fs.readFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/startPage.json' ) ) );
            conf = JSON.parse( fs.readFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/startPage.config.json' ) ) );
            return { 'conf': conf, 'options': options };
        } catch ( err ) {
            return {};
        }
    }

    findAllStartPageTemplates() {
        return fs.readdirSync( path.join( __dirname + '/../ui/home/templates/' ) );
    }

    setActiveStartPage( startPageName ) {
        this.settings[ 'startPage' ] = startPageName;
        db.saveSettings( this.settings );
    }

    async renderStartPage( startPageName ) {
        this.setActiveStartPage( startPageName );
        let self = this;
        const app = createSSRApp( {
            data() {
                return {
                    'data': self.loadStartPagePreferences( startPageName ),
                    'pageName': self.settings.pageName,
                };
            },
            template: '' + fs.readFileSync( path.join( __dirname + '/../ui/home/templates/' + startPageName + '/index.html' ) )
        } );

        fs.writeFileSync( path.join( __dirname + '/../ui/home/active/en/index.html' ), await renderToString( app ) );
        return true;
    }
}

module.exports = StartPageManager;