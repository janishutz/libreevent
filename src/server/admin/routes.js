/*
*				myevent - routes.js (admin)
*
*	Created by Janis Hutz 03/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const pwdmanager = require( './pwdmanager.js' );


module.exports = ( app, settings ) => {
    /* 
        Static routes for files like login screen, css, js and assets. Js and assets require login
    */
    app.get( '/admin/login', ( request, response ) => {
        if ( request.session.loggedIn ) {
            response.redirect( '/admin' );
        } else {
            response.sendFile( path.join( __dirname + '/ui/login.html' ) );
        }
    } );

    app.get( '/admin/loginLangPack', ( request, response ) => {
        response.sendFile( path.join( __dirname + '/ui/js/loginLangPack.js' ) );
    } );

    app.get( '/admin/css/:file', ( request, response ) => {
        response.sendFile( path.join( __dirname + '/ui/css/' + request.params.file ) );
    } );

    /* 
        Admin login route that checks the password and, if enabled in settings, redirects to 2fa page or directly to admin panel
    */
    app.post( '/admin/auth', ( request, response ) => {
        pwdmanager.checkpassword( request.body.mail, request.body.pwd ).then( data => {
            if ( data ) {
                if ( settings.twoFA ) {
                    response.sendFile( path.join( __dirname + '../admin/ui/2fa.html' ) );
                } else {
                    request.session.loggedIn = true;
                    response.redirect( '/admin' );
                }
            } else {
                response.send( 'Password wrong' );
            }
        } );
    } );
    
    app.get( '/admin/logout', ( request, response ) => {
        request.session.loggedIn = false;
        response.send( 'logged out' );
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
                response.sendFile( path.join( __dirname + '/ui/welcome.html' ) );
            }
        } else {
            response.redirect( '/admin/login' );
        }
    } );

    app.get( '/admin/setup', ( request, response ) => {
        if ( request.session.loggedIn ) {
            response.sendFile( path.join( __dirname + '/ui/setup.html' ) );
        } else {
            response.redirect( '/admin/login' );
        }
    } );
};