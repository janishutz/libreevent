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
    }

    connect () {
        this.db = JSON.parse( fs.readFileSync( path.join( __dirname + '/data/db.json' ) ) );
        this.db[ 'libreevent_temp' ] = {};
        setInterval( async () => {
            fs.writeFile( path.join( __dirname + '/data/db.json' ), JSON.stringify( this.db ) );
        }, 10000 );
        console.log( '[ JSON-DB ] Database initialized successfully' );
        return 'connection';
    }

    async resetDB () {
        this.db = {};
        fs.writeFile( path.join( __dirname + '/data/db.json' ), JSON.stringify( this.db ) );
    }

    async setupDB () {
        this.db = { 'libreevent_temp': {}, 'libreevent_admin': {}, 'libreevent_orders': {}, 'libreevent_users': {} };
        fs.writeFile( path.join( __dirname + '/data/db.json' ), JSON.stringify( this.db ) );
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
                resolve( this.db[ table ] );
            } else if ( operation.command === 'getFilteredData' ) {
                let ret = {};
                for ( let entry in this.db[ table ] ) {
                    if ( this.db[ table ][ entry ][ operation.property ] == operation.searchQuery ) {
                        ret[ entry ] = this.db[ table ][ entry ];
                    }
                }
                return ret;
            } else if ( operation.command === 'addData' ) {
                //
            } else if ( operation.command === 'updateData' ) {
                if ( !operation.property || !operation.searchQuery ) reject( 'Refusing to run destructive command: Missing Constraints' );
                else {
                    //
                }
            } else if ( operation.command === 'deleteData' ) {
                if ( !operation.property || !operation.searchQuery ) reject( 'Refusing to run destructive command: Missing Constraints' );
                else {
                    //
                }
            } else if ( operation.command === 'InnerJoin' ) {
                //
            } else if ( operation.command === 'LeftJoin' ) {
                //
            } else if ( operation.command === 'RightJoin' ) {
                //
            } else if ( operation.command === 'checkDataAvailability' ) {
                // 
            }
        } );
    }
}

module.exports = JSONDB;