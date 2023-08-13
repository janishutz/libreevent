/*
*				libreevent - pluginLoader.js
*
*	Created by Janis Hutz 08/13/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( app, settings ) => {
    let otherPlugins = fs.readdirSync( path.join( __dirname + '/others' ) );
    console.log( '\n\n' );
    for ( let plugin in otherPlugins ) {
        console.log( '[ Plugin Loader ] Loaded plugin "' + otherPlugins[ plugin ] + '"' );
        require( './others/' + otherPlugins[ plugin ] + '/' + otherPlugins[ plugin ] + 'Routes.js' )( app, settings );
    }

    require( './payments/' + settings.payments + '/' + settings.payments + 'Routes.js' )( app, settings );
    console.log( '[ Plugin Loader ] Loaded ' + settings.payments + ' as payment gateway' );
};