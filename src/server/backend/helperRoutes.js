const path = require( 'path' );

module.exports = ( app, settings ) => {
    app.get( '/eventAssets/:image', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../assets/events/' + req.params.image ) );
    } );

    app.get( '/otherAssets/:image', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../assets/' + req.params.image ) );
    } );

    app.get( '/supportFiles/:file', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../ui/home/templates/' + settings.startPage + '/supportFiles/' + req.params.file ) );
    } );

    app.get( '/startPage/helperFunction', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../ui/home/helper.js' ) );
    } );

    app.get( '/startPage/mainStyle', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../ui/home/main.css' ) );
    } );

    app.get( '/startPage/assets/:image', ( req, res ) => {
        res.sendFile( path.join( __dirname + '/../assets/' + settings.startPage + '/assets/' + req.params.image  ) );
    } );

    app.get( '/startPage/preview/:template', ( req, res ) => {
        // TODO: only allow when logged in
        res.sendFile( path.join( __dirname + '/../ui/home/templates/' + req.params.template + '/index.html' ) );
    } );
};