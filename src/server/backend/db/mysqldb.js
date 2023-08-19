/*
*				libreevent - mysqldb.js
*
*	Created by Janis Hutz 07/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const mysql = require( 'mysql' );
const fs = require( 'fs' );
const path = require( 'path' );

// If the connection does not work for you, you will need to add your ip
// to the whitelist of the database

class SQLDB {
    constructor ( ) {
        this.sqlConnection = mysql.createConnection( JSON.parse( fs.readFileSync( path.join( __dirname + '/../../config/db.config.secret.json' ) ) ) );
    }

    connect ( ) {
        const self = this;
        this.sqlConnection.connect( function( err ) {
            if ( err ) {
                console.error( '[ SQL ]: An error ocurred whilst connecting: ' + err.stack );
                return;
            }
            console.log( '[ SQL ] Connected to database successfully' );
            self.sqlConnection.query( 'TRUNCATE libreevent_temp;', error => {
                if ( error ) {
                    console.error( '[ SQL ] Unable to truncate libreevent_temp table due to the following error: ' + error.code );
                } else {
                    console.log( '[ SQL ] Truncated temporary data table successfully' );
                }
            } );
            return 'connection';
        } );
    }

    disconnect ( ) {
        this.sqlConnection.end();
    }

    async resetDB ( ) {
        this.sqlConnection.query( 'DROP TABLE libreevent_orders;', ( error ) => {
            if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
            this.sqlConnection.query( 'DROP TABLE libreevent_users;', ( error ) => {
                if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
                this.sqlConnection.query( 'DROP TABLE libreevent_admin;', ( error ) => {
                    if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
                    this.sqlConnection.query( 'DROP TABLE libreevent_temp;', ( error ) => {
                        if ( error ) if ( error.code !== 'ER_BAD_TABLE_ERROR' ) throw error;
                        return 'done';
                    } );
                } );
            } );
        } );
    }

    async setupDB ( ) {
        this.sqlConnection.query( 'SELECT @@default_storage_engine;', ( error, results ) => {
            if ( error ) throw error;
            if ( results[ 0 ][ '@@default_storage_engine' ] !== 'InnoDB' ) throw 'DB HAS TO USE InnoDB!';
        } );
        this.sqlConnection.query( 'CREATE TABLE libreevent_users ( account_id INT ( 10 ) NOT NULL AUTO_INCREMENT, email TINYTEXT NOT NULL, pass TEXT, name TEXT, first_name TEXT, two_fa TINYTEXT, user_data VARCHAR( 60000 ), mail_confirmed TINYTEXT, marketing TINYTEXT, PRIMARY KEY ( account_id ) ) ENGINE=INNODB;', ( error ) => {
            if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
            this.sqlConnection.query( 'CREATE TABLE libreevent_orders ( order_id INT ( 10 ) NOT NULL AUTO_INCREMENT, order_name TINYTEXT, account_id INT ( 10 ) NOT NULL, tickets VARCHAR( 60000 ), processed TINYTEXT, timestamp TINYTEXT, PRIMARY KEY ( order_id ), FOREIGN KEY ( account_id ) REFERENCES libreevent_users( account_id ) ) ENGINE=INNODB;', ( error ) => {
                if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
                this.sqlConnection.query( 'CREATE TABLE libreevent_admin ( account_id INT NOT NULL AUTO_INCREMENT, email TINYTEXT, pass TEXT, permissions VARCHAR( 1000 ), username TINYTEXT, two_fa TINYTEXT, PRIMARY KEY ( account_id ) );', ( error ) => {
                    if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
                    this.sqlConnection.query( 'CREATE TABLE libreevent_temp ( entry_id INT NOT NULL AUTO_INCREMENT, user_id TINYTEXT, data VARCHAR( 60000 ), timestamp TINYTEXT, PRIMARY KEY ( entry_id ) );', ( error ) => {
                        if ( error ) if ( error.code !== 'ER_TABLE_EXISTS_ERROR' ) throw error;
                        return 'DONE';
                    } );
                } );
            } );
        } );
    }

    query ( operation, table ) {
        return new Promise( ( resolve, reject ) => {
            /* 
                Possible operation.command values (all need the table argument of the method call):
                    - getAllData: no additional instructions needed

                    - getFilteredData: 
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])

                    - InnerJoin (Select values that match in both tables):
                        - operation.property (the column to search for the value),
                        - operation.searchQuery (the value to search for [will be sanitised by method])
                        - operation.selection (The columns of both tables to be selected, e.g. users.name, orders.id)
                        - operation.secondTable (The second table to perform Join operation with)
                        - operation.matchingParam (Which properties should be matched to get the data, e.g. order.user_id=users.id)

                    - LeftJoin (Select values in first table and return all corresponding values of second table): 
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])
                        - operation.selection (The columns of both tables to be selected, e.g. users.name, orders.id)
                        - operation.secondTable (The second table to perform Join operation with)
                        - operation.matchingParam (Which properties should be matched to get the data, e.g. order.user_id=users.id)

                    - RightJoin (Select values in second table and return all corresponding values of first table): 
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])
                        - operation.selection (The columns of both tables to be selected, e.g. users.name, orders.id)
                        - operation.secondTable (The second table to perform Join operation with)
                        - operation.matchingParam (Which properties should be matched to get the data, e.g. order.user_id=users.id)

                    - addData:
                        - operation.data (key-value pair with all data as values and column to insert into as key)
                    
                    - deleteData:
                        - operation.property (the column to search for the value)
                        - operation.searchQuery (the value to search for [will be sanitised by method])
                    
                    - updateData:
                        - operation.newValues (a object with keys being the column and value being the value to be inserted into that column, values are being
                            sanitised by the function)
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])

                    - checkDataAvailability:
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])

                    - fullCustomCommand:
                        - operation.query (the SQL instruction to be executed) --> NOTE: This command will not be sanitised, so use only with proper sanitisation!
            */
            let command = '';
            if ( operation.command === 'getAllData' ) {
                command = 'SELECT * FROM ' + table;
            } else if ( operation.command === 'getFilteredData' || operation.command === 'checkDataAvailability' ) {
                command = 'SELECT * FROM ' + table + ' WHERE ' + operation.property + ' = ' + this.sqlConnection.escape( operation.searchQuery );
            } else if ( operation.command === 'fullCustomCommand' ) {
                command = operation.query;
            } else if ( operation.command === 'addData' ) {
                let keys = '';
                let values = '';
                for ( let key in operation.data ) {
                    keys += String( key ) + ', ';
                    values += this.sqlConnection.escape( String( operation.data[ key ] ) ) + ', ' ;
                }
                command = 'INSERT INTO ' + table + ' (' + keys.slice( 0, keys.length - 2 ) + ') VALUES (' +  values.slice( 0, values.length - 2 ) + ');';
            } else if ( operation.command === 'updateData' ) {
                if ( !operation.property || !operation.searchQuery ) reject( 'Refusing to run destructive command: Missing Constraints' );
                else {
                    command = 'UPDATE ' + table + ' SET ';
                    let updatedValues = '';
                    for ( let value in operation.newValues ) {
                        updatedValues += value + ' = ' + this.sqlConnection.escape( operation.newValues[ value ] ) + ', ';
                    }
                    command += updatedValues.slice( 0, updatedValues.length - 2 );
                    command += ' WHERE ' + operation.property + ' = ' + this.sqlConnection.escape( operation.searchQuery );
                }
            } else if ( operation.command === 'deleteData' ) {
                if ( !operation.property || !operation.searchQuery ) reject( 'Refusing to run destructive command: Missing Constraints' );
                else {
                    command = 'DELETE FROM ' + table + ' WHERE ' + operation.property + ' = ' + this.sqlConnection.escape( operation.searchQuery );
                }
            } else if ( operation.command === 'InnerJoin' ) {
                command = 'SELECT ' + operation.selection + ' FROM ' + table + ' WHERE ' + operation.property + ' = ' + this.sqlConnection.escape( operation.searchQuery ) + ' INNER JOIN ' + operation.secondTable + ' ON ' + operation.matchingParam;
            } else if ( operation.command === 'LeftJoin' ) {
                command = 'SELECT ' + operation.selection + ' FROM ' + table + ' WHERE ' + operation.property + ' = ' + this.sqlConnection.escape( operation.searchQuery ) + ' LEFT JOIN ' + operation.secondTable + ' ON ' + operation.matchingParam;
            } else if ( operation.command === 'RightJoin' ) {
                command = 'SELECT ' + operation.selection + ' FROM ' + table + ' WHERE ' + operation.property + ' = ' + this.sqlConnection.escape( operation.searchQuery ) + ' RIGHT JOIN ' + operation.secondTable + ' ON ' + operation.matchingParam;
            }
            this.sqlConnection.query( command, ( error, results ) => {
                if ( error ) reject( error );
                resolve( results );
            } );
        } );
    }
}

module.exports = SQLDB;