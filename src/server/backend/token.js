/*
*				libreevent - token.js
*
*	Created by Janis Hutz 07/08/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/


module.exports.generateToken = () => {
    let token = '';
    let min = 48;
    let max = 122;
    for ( let i = 0; i < 61; i++ ) {
        let randomNumber = Math.floor( Math.random() * ( max - min ) ) + min;
        while ( randomNumber === 92 || randomNumber === 58 || randomNumber === 96 || randomNumber === 94 || randomNumber === 64 ) {
            randomNumber = Math.floor( Math.random() * ( max - min ) ) + min;
        }
        token += String.fromCharCode( randomNumber );
    }
    return token;
};