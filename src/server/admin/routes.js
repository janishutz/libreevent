/*
*				libreevent - routes.js (admin)
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
                    request.session.loggedInAdmin = true;
                    response.send( 'ok' );
                }
            } else {
                response.send( 'pwErr' );
            }
        } );
    } );

    app.get( '/test/login', ( request, response ) => {
        request.session.loggedInAdmin = true;
        response.send( 'Logged in' );
    } );
    
    app.get( '/admin/logout', ( request, response ) => {
        request.session.loggedInAdmin = false;
        response.send( 'logged out' );
    } );

    app.get( '/api/getAuth', ( request, response ) => {
        response.send( { 'admin': request.session.loggedInAdmin ? true : false, 'user': request.session.loggedInUser ? true : false } );
    } );
};