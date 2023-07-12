/*
*				libreevent - 2fa.js
*
*	Created by Janis Hutz 07/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const token = require( '../token.js' );

class TwoFA {
    constructor () {
        this.tokenStore = {};
    }

    registerStandardAuthentication () {
        let tok = token.generateToken( 61 );
        this.tokenStore[ tok ] = { 'mode': 'standard' };
        return { 'token': tok };
    }
    
    registerEnhancedAuthentication () {
        let tok = token.generateToken( 61 );
        let code = token.generateNumber( 7 );
        this.tokenStore[ tok ] = { 'mode': 'enhanced', 'code': code };
        return { 'code': code, 'token': tok };
    }

    verifyEnhanced ( token, number = '' ) {
        if ( this.tokenStore[ token ]?.mode === 'standard' ) return true;
        else if ( this.tokenStore[ token ]?.mode === 'enhanced' ) {
            if ( this.tokenStore[ token ].code == number ) return true;
            else return false;
        } else return false;
    }

    verifySimple ( token ) {
        if ( this.tokenStore[ token ]?.mode === 'standard' ) return 'standard';
        else if ( this.tokenStore[ token ]?.mode === 'enhanced' ) return 'enhanced';
        else return 'invalid';
    }
}

module.exports = TwoFA;