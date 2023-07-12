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
        let token = token.generateToken();
        this.tokenStore[ token ] = 'standard';
    }
    
    registerEnhancedAuthentication () {
        let token = token.generateToken();

    }
}

module.exports = TwoFA;