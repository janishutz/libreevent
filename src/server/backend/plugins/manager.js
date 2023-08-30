/*
*				libreevent - manager.js
*
*	Created by Janis Hutz 07/25/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

/* 
    This is the plugin manager. It is responsible for installing, updating and uninstalling plugins.
*/

const fs = require( 'fs' );
const path = require( 'path' );

class PluginManager {
    constructor ( settings ) {
        this.paymentGateway = settings.payments;
        this.allPlugins = {};
        fs.readdir( path.join( __dirname + '/others' ), ( err, ls ) => {
            for ( let file in ls ) {
                const pluginSettings = JSON.parse( fs.readFileSync( path.join( __dirname + '/others/' + ls[ file ] + '/plugin.json' ) ) );
                this.allPlugins[ ls[ file ] ] = pluginSettings;
            }
        } );
    }

    getPlugins () {
        
    }

    getPluginDetails ( plugin ) {
        return new Promise( ( resolve, reject ) => {
            fs.readFile( path.join( __dirname + '/others/' + plugin + '/plugin.json' ), ( err, file ) => {
                if ( err ) reject( err );
                resolve( file );
            } );
        } );
    }

    loadPaymentGatewaySettings () {
        return new Promise( ( resolve, reject ) => {
            fs.readFile( path.join( __dirname + '/payments/' + this.paymentGateway + '/configOptions.json' ), ( err, optionsBuffer ) => {
                if ( err ) reject( err );
                fs.readFile( path.join( __dirname + '/payments/' + this.paymentGateway + '/config.payments.json' ), ( err, configBuffer ) => {
                    if ( err ) reject( err );
                    let options, config;
                    try { 
                        options = JSON.parse( optionsBuffer );
                        config = JSON.parse( configBuffer );
                    } catch ( err ) {
                        reject( err );
                        return;
                    }
                    let f = options;
                    for ( let s in f ) {
                        f[ s ][ 'value' ] = config[ s ];
                    }
                    resolve( { 'data': f, 'gateway': this.paymentGateway } );
                } );
            } );
        } );
    }

    savePaymentGatewaySettings () {
        return new Promise( ( resolve, reject ) => {
            
        } );
    }

    saveSettings ( plugin, settings ) {
        
    }
}

module.exports = PluginManager;