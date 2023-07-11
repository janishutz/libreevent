/* 
*
*   LANGUAGE SCHOOL HOSSEGOR - Booking system
*               mailManager.js
*
*       Developed 2022 by Janis Hutz
*
*/
// import and init of nodemailer middleware
const mailer = require( 'nodemailer' );
const html2text = require( 'html-to-text' );

// import jsondb.js file and let it import mail config

var transporter = mailer.createTransport(  );

class MailManager {
    constructor () {
        this.options = {
            wordwrap: 130
        };
    }

    /* 
      This method sends a mail with recipient, html, subject and sender as arguments
    */
    sendMail ( recipient, html, subject, sender ) {
        let text = html2text.convert( html, this.options );
        var mailOptions = {
            from: sender,
            to: recipient,
            subject: subject,
            html: html,
            text: text,
        };

        transporter.sendMail( mailOptions, function ( error ) {
            if ( error ) {
                console.log( error );
            }
        } );
    }

    sendMailWithAttachment ( recipient, html, subject, attachments, from ) {
        let text = html2text.convert( html, this.options );
        var mailOptions = {
            from: from,
            to: recipient,
            subject: subject,
            html: html,
            text: text,
            attachments: attachments
        };

        transporter.sendMail( mailOptions, function ( error ) {
            if ( error ) {
                console.log( error );
            }
        } );
    }
}

module.exports = MailManager;