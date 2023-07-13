/*
*				libreevent - 2fa.js
*
*	Created by Janis Hutz 07/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const token = require( '../token.js' );
// let createSSRApp = require( 'vue' ).createSSRApp;
// let renderToString = require( 'vue/server-renderer' ).renderToString;

class TwoFA {
    constructor () {
        this.tokenStore = {};
        this.references = {};
    }

    registerStandardAuthentication () {
        let tok = token.generateToken( 60 );
        while ( this.tokenStore[ tok ] ) {
            tok = token.generateToken( 60 );
        }
        this.tokenStore[ tok ] = { 'mode': 'standard' };
        return { 'token': tok };
    }
    
    registerEnhancedAuthentication () {
        let tok = token.generateToken( 60 );
        while ( this.tokenStore[ tok ] ) {
            tok = token.generateToken( 60 );
        }
        let code = token.generateNumber( 6 );
        this.tokenStore[ tok ] = { 'mode': 'enhanced', 'code': code };
        return { 'code': code, 'token': tok };
    }

    storeTokenReference ( token, sessionID ) {
        this.references[ token ] = sessionID;
    }

    getTokenReference ( token ) {
        return this.references[ token ];
    }

    verifyEnhanced ( token, number = '' ) {
        if ( this.tokenStore[ token ]?.mode === 'standard' ) return true;
        else if ( this.tokenStore[ token ]?.mode === 'enhanced' ) {
            if ( this.tokenStore[ token ].code == number ) { 
                delete this.tokenStore[ token ];
                return true;
            } else return false;
        } else return false;
    }

    verifySimple ( token ) {
        if ( this.tokenStore[ token ]?.mode === 'standard' ) {
            delete this.tokenStore[ token ];
            return 'standard';
        } else if ( this.tokenStore[ token ]?.mode === 'enhanced' ) return 'enhanced';
        else return 'invalid';
    }
}

module.exports = TwoFA;