/*
*				libreevent - module.payrexx.js
*
*	Created by Janis Hutz 08/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const fs = require( 'fs' );
const path = require( 'path' );
const qs = require( 'qs' );
const axios = require( 'axios' );
const Base64 = require( 'crypto-js/enc-base64' );
const hmacSHA256 = require( 'crypto-js/hmac-sha256' );
const payrexxConfig = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../../../config/payments.config.secret.json' ) ) )[ 'payrexx' ];

const baseUrl = 'https://api.payrexx.com/v1.0/';
const instance = payrexxConfig.instance;
const secret = payrexxConfig.APISecret;

exports.init = function () {
    function buildSignature ( query = '' ) {
        return Base64.stringify( hmacSHA256( query, secret ) );
    }

    function buildBaseUrl ( path ) {
        return baseUrl + path + '?instance=' + instance;
    }

    return {
        getGateway: function ( id ) {
            const baseUrl = buildBaseUrl( 'Gateway/' + id + '/' );
            const url = baseUrl + '&ApiSignature=' + buildSignature();
            return axios.get( url );
        },
        createGateway: function ( params ) {
            if ( !params.amount ) {
                throw new Error( 'Amount required!' );
            }

            const defaultParams = {
                currency: 'CHF'
            };

            let queryParams = Object.assign( {}, defaultParams, params );

            const queryStr = qs.stringify( queryParams, { format: 'RFC1738' } );
            const signature = buildSignature( queryStr );

            queryParams.ApiSignature = signature;
            const queryStrSigned = qs.stringify( queryParams );

            const baseUrl = buildBaseUrl( 'Gateway/' );
            return axios.post( baseUrl, queryStrSigned );
        }
    };
};
