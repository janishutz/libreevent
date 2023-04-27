/*
*				myevent - routes.js (admin)
*
*	Created by Janis Hutz 03/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const pwdmanager = require( './pwdmanager.js' );

module.exports = ( app, settings ) => {
    /* 
        Admin login route that checks the password
    */
   
    app.post( '/admin/auth', ( request, response ) => {
        pwdmanager.checkpassword( request.body.mail, request.body.pwd ).then( data => {
            if ( data ) {
                if ( settings.twoFA ) {
                    response.send( '2fa' );
                } else {
                    request.session.loggedIn = true;
                    response.send( 'ok' );
                }
            } else {
                response.send( 'pwErr' );
            }
        } );
    } );
    
    app.get( '/admin/logout', ( request, response ) => {
        request.session.loggedIn = false;
        response.send( 'logged out' );
    } );

    app.get( '/admin/getLoginStatus', ( request, response ) => {
        response.send( request.session.loggedIn );
    } );
};