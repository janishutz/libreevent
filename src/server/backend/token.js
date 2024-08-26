/*
*				libreevent - token.js
*
*	Created by Janis Hutz 07/08/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/


module.exports.generateToken = ( length ) => {
    let token = '';
    let min = 45;
    let max = 122;
    for ( let i = 0; i < length; i++ ) {
        let randomNumber = Math.floor( Math.random() * ( max - min ) ) + min;
        while ( ( 58 < randomNumber && randomNumber < 63 ) || ( 90 < randomNumber && randomNumber < 95 ) || ( 95 < randomNumber && randomNumber < 97 ) ) {
            randomNumber = Math.floor( Math.random() * ( max - min ) ) + min;
        }
        token += String.fromCharCode( randomNumber );
    }
    return token;
};

module.exports.generateNumber = ( length ) => {
    let number = '';
    for ( let i = 0; i < length; i++ ) {
        number += Math.floor( Math.random() * 10 );
    }
    return number;
};