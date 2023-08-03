/*
*				libreevent - successHandler.js
*
*	Created by Janis Hutz 08/02/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

class PaymentHandler {
    constructor () {
        this.canceledTransactions = {};
    }

    async handleSuccess ( token ) {
        console.log( token );
    }

    async handleError ( token ) {
        
    }
}

module.exports = PaymentHandler;