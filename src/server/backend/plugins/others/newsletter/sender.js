/*
*				libreevent - sender.js
*
*	Created by Janis Hutz 09/16/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const mm = require( '../../../mail/mailSender.js' );
const mailManager = new mm();
const db = require( '../../../db/db.js' );


class sendMail {
    constructor( settings ) {
        this.settings = settings;
    }

    send ( message, subject ) {
        db.getDataSimple( 'users', 'marketing', 'true' ).then( users => {
            for ( let user in users ) {
                mailManager.sendMail( users[ user ].email, message, subject, this.settings.mailSender );
            }
        } );
    }

    unsubscribe ( mail ) {
        db.writeDataSimple( 'users', 'email', mail, { 'marketing': false } );
    }
}

module.exports = sendMail;