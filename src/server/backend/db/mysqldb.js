/*
*				libreevent - mysqldb.js
*
*	Created by Janis Hutz 07/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const mysql = require( 'mysql' );
const db = require( './db.js' );

// If the connection does not work for you, you will need to add your ip
// to the whitelist of the database

class SQLDB {
    constructor () {
        this.sqlConnection = mysql.createConnection( db.getJSONDataSync( '/config/db.config.secret.json' ) );
    }

    connect () {
        this.sqlConnection.connect( function( err ) {
            if ( err ) {
                console.error( 'error connecting: ' + err.stack );
                return;
            }
            return 'connection';
        } );
    }

    disconnect () {
        this.sqlConnection.end();
    }

    async setupDB () {
        this.sqlConnection.query( '' );
    }
}

module.exports = SQLDB;