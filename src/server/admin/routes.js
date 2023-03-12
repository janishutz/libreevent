/*
*				myevent - routes.js (admin)
*
*	Created by Janis Hutz 03/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );

module.exports = ( app, settings ) => {
    app.get( '/admin/login', ( request, response ) => {
        response.sendFile( path.join( __dirname + '/ui/login.html' ) );
    } );
    
    /* 
        main admin panel access route. Will serve an html file
        that uses vue.js in its SPA form to make the admin panel
        more responsive. Same technology is also used in the purchasing
        system itself.
    */
    app.get( '/admin', ( request, response ) => {
        if ( request.session.loggedIn ) {
            if ( settings[ 'init' ] ) {
                response.sendFile( path.join( __dirname + '/ui/panel.html' ) );
            } else {
                response.sendFile( path.join( __dirname + '/ui/setup.html' ) );
            }
        } else {
            response.redirect( '/admin/login' );
        }
    } );
};