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
        this.pluginDetails = {};
        fs.readdir( path.join( __dirname + '/others' ), ( err, ls ) => {
            for ( let file in ls ) {
                const pluginDetail = JSON.parse( fs.readFileSync( path.join( __dirname + '/others/' + ls[ file ] + '/plugin.json' ) ) );
                this.pluginDetails[ ls[ file ] ] = pluginDetail;
            }
        } );
    }

    getPlugins () {
        return this.pluginDetails;
    }

    loadPaymentGatewaySettings () {
        return new Promise( ( resolve, reject ) => {
            this.paymentGateway = JSON.parse( fs.readFileSync( path.join( __starterDir + '/config/settings.config.json' ) ) ).payments;
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

    savePaymentGatewaySettings ( settings ) {
        return new Promise( ( resolve, reject ) => {
            fs.writeFile( path.join( __dirname + '/payments/' + this.paymentGateway + '/config.payments.json' ), JSON.stringify( settings ), {}, ( err ) => {
                if ( err ) reject( err );
                resolve( 'ok' );
            } );
        } );
    }
}

module.exports = PluginManager;