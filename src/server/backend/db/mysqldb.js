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

    async resetDB ( ) {
        this.sqlConnection.query( 'DROP TABLE libreevent_orders;', ( error ) => {
            if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
            this.sqlConnection.query( 'DROP TABLE libreevent_users;', ( error ) => {
                if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
                this.sqlConnection.query( 'DROP TABLE libreevent_admin;', ( error ) => {
                    if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
                    return 'done';
                } );
            } );
        } );
    }

    async setupDB ( ) {
        this.sqlConnection.query( 'SELECT @@default_storage_engine;', ( error, results ) => {
            if ( error ) throw error;
            if ( results[ 0 ][ '@@default_storage_engine' ] !== 'InnoDB' ) return 'DB HAS TO USE InnoDB!';
        } );
        this.sqlConnection.query( 'CREATE TABLE libreevent_users ( account_id INT ( 10 ) NOT NULL AUTO_INCREMENT, email TINYTEXT NOT NULL, pass TEXT, street TEXT, house_number TINYTEXT, country TEXT, phone TEXT, name TEXT, first_name TEXT, data VARCHAR( 10000 ), PRIMARY KEY ( account_id ) ) ENGINE=INNODB;', ( error ) => {
            if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
            this.sqlConnection.query( 'CREATE TABLE libreevent_orders ( order_id INT ( 10 ) NOT NULL AUTO_INCREMENT, account_id INT ( 10 ) NOT NULL, seats VARCHAR( 30000 ), PRIMARY KEY ( order_id ), FOREIGN KEY ( account_id ) REFERENCES libreevent_users( account_id ) ) ENGINE=INNODB;', ( error ) => {
                if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
                this.sqlConnection.query( 'CREATE TABLE libreevent_admin ( account_id INT NOT NULL AUTO_INCREMENT, email TINYTEXT, pass TEXT, permissions VARCHAR( 1000 ), PRIMARY KEY ( account_id ) );', ( error ) => {
                    if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
                } );
            } );
        } );
    }

    query ( operation, dataToBeInserted ) {
        // Legal options for the operation parameter are objects with the command attribute:
        // getAllData, getFilteredData, getRelationalData, 
        this.sqlConnection.query();
    }
}

module.exports = SQLDB;