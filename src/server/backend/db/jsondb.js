/*
*				libreevent - jsondb.js
*
*	Created by Janis Hutz 07/11/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const fs = require( 'fs' );
const path = require( 'path' );

class JSONDB {
    constructor () {
        this.db = {};
        this.dbIndex = { 'libreevent_temp': 0, 'libreevent_admin': 0, 'libreevent_orders': 0, 'libreevent_users': 0 };
        this.isSaving = false;
        this.awaitingSaving = true;
    }

    connect () {
        let data = {};
        try {
            JSON.parse( fs.readFileSync( path.join( __dirname + '/../../data/db.json' ) ) );
        } catch ( err ) {
            console.error( '[ JSON-DB ] CRITICAL INITIALIZATION FAILURE!' + err );
            throw ( 'JSONDB failed to start!' );
        }
        this.db = data[ 'db' ] ?? { 'libreevent_temp': {}, 'libreevent_admin': {}, 'libreevent_orders': {}, 'libreevent_users': {} };
        this.dbIndex = data[ 'index' ] ?? { 'libreevent_temp': 0, 'libreevent_admin': 0, 'libreevent_orders': 0, 'libreevent_users': 0 };
        this.db[ 'libreevent_temp' ] = {};
        this.saveToDisk();
        console.log( '[ JSON-DB ] Database initialized successfully' );
        return 'connection';
    }

    async saveToDisk () {
        if ( !this.isSaving ) {
            this.awaitingSaving = false;
            this.save();
        } else {
            this.awaitingSaving = true;
        }
    }

    save () {
        fs.writeFile( path.join( __dirname + '/../../data/db.json' ), JSON.stringify( { 'db': this.db, 'index': this.dbIndex } ), ( err ) => {
            if ( err ) console.error( '[ JSON-DB ] An error occurred during saving: ' + err );
            this.isSaving = false;
            if ( this.awaitingSaving ) {
                this.saveToDisk();
            }
        } );
    }

    async resetDB () {
        this.db = { 'libreevent_temp': {}, 'libreevent_admin': {}, 'libreevent_orders': {}, 'libreevent_users': {} };
        this.dbIndex = { 'libreevent_temp': 0, 'libreevent_admin': 0, 'libreevent_orders': 0, 'libreevent_users': 0 };
        fs.writeFile( path.join( __dirname + '/../../data/db.json' ), JSON.stringify( { 'db': this.db, 'index': this.dbIndex } ) );
    }

    async setupDB () {
        this.db = { 'libreevent_temp': {}, 'libreevent_admin': {}, 'libreevent_orders': {}, 'libreevent_users': {} };
        this.dbIndex = { 'libreevent_temp': 0, 'libreevent_admin': 0, 'libreevent_orders': 0, 'libreevent_users': 0 };
        fs.writeFile( path.join( __dirname + '/../../data/db.json' ), JSON.stringify( { 'db': this.db, 'index': this.dbIndex } ) );
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
                     
                    - updateData:
                        - operation.newValues (a object with keys being the column and value being the value to be inserted into that column, values are being
                            sanitised by the function)
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])

                    - checkDataAvailability:
                        - operation.property (the column to search for the value), 
                        - operation.searchQuery (the value to search for [will be sanitised by method])
            */
            
            if ( operation.command === 'getAllData' ) {
                let ret = [];
                for ( let entry in this.db[ table ] ) {
                    ret.push( this.db[ table ][ entry ] );
                }
                resolve( ret );
            } else if ( operation.command === 'getFilteredData' || operation.command === 'checkDataAvailability' ) {
                let ret = [];
                for ( let entry in this.db[ table ] ) {
                    if ( this.db[ table ][ entry ][ operation.property ] == operation.searchQuery ) {
                        ret.push( this.db[ table ][ entry ] );
                    }
                }
                resolve( ret );
            } else if ( operation.command === 'addData' ) {
                this.dbIndex[ table ] += 1;
                this.db[ table ][ this.dbIndex[ table ] ] = operation.data;
                this.saveToDisk();
                resolve( true );
            } else if ( operation.command === 'updateData' ) {
                if ( !operation.property || !operation.searchQuery ) reject( 'Refusing to run destructive command: Missing Constraints' );
                else {
                    for ( let entry in this.db[ table ] ) {
                        if ( this.db[ table ][ entry ][ operation.property ] == operation.searchQuery ) {
                            for ( let changed in operation.newValues ) {
                                this.db[ table ][ entry ][ changed ] = operation.newValues[ changed ];
                            }
                        }
                    }
                }
                this.saveToDisk();
                resolve( true );
            } else if ( operation.command === 'deleteData' ) {
                if ( !operation.property || !operation.searchQuery ) reject( 'Refusing to run destructive command: Missing Constraints' );
                else {
                    for ( let entry in this.db[ table ] ) {
                        if ( this.db[ table ][ entry ][ operation.property ] == operation.searchQuery ) {
                            delete this.db[ table ][ entry ];
                        }
                    }
                }
                this.saveToDisk();
                resolve( true );
            } else if ( operation.command === 'InnerJoin' ) {
                // TODO: Finish those when actually needed
            } else if ( operation.command === 'LeftJoin' ) {
                //
            } else if ( operation.command === 'RightJoin' ) {
                //
            }
        } );
    }
}

module.exports = JSONDB;