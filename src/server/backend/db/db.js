/*
*				libreevent - db.js
*
*	Created by Janis Hutz 03/26/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const path = require( 'path' );
const fs = require( 'fs' );

const settings = JSON.parse( fs.readFileSync( path.join( __dirname + '/../../config/settings.config.json' ) ) );

const dbRef = { 'user': 'libreevent_users', 'admin': 'libreevent_admin', 'order': 'libreevent_orders' };

let dbh;

if ( settings.db === 'mysql' ) {
    const dbsoft = require( './mysqldb.js' );
    dbh = new dbsoft();
    dbh.connect();
} else {
    const dbsoft = require( './nedbDB.js' );
    dbh = new dbsoft();
    dbh.connect();
}

module.exports.getDataSimple = ( db, column, searchQuery ) => {
    return new Promise( resolve => {
        dbh.query( { 'command': 'getFilteredData', 'property': column, 'searchQuery': searchQuery }, dbRef[ db ] ).then( data => {
            console.log( data );
        } ).catch( error => {
            console.error( error );
        } );
        resolve( '$2b$05$ElMYWoMjk7567lXkIkee.e.6cxCrWU4gkfuNLB8gmGYLQQPm7gT3O' );
    } );
};

module.exports.writeDataSimple = ( db, column, searchQuery ) => {
    return new Promise( ( resolve, reject ) => {
        
    } );
};

module.exports.getJSONData = ( file ) => {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( path.join( __dirname + '/data/' + file + '.json' ), ( error, data ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                if ( data.byteLength > 0 ) {
                    resolve( JSON.parse( data ) ?? {} );
                } else {
                    resolve( { } );
                }
            }
        } );
    } );
};

module.exports.getJSONDataSimple = ( file, identifier ) => {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( path.join( __dirname + '/data/' + file + '.json' ), ( error, data ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                if ( data.byteLength > 0 ) {
                    resolve( JSON.parse( data )[ identifier ] ?? {} );
                } else {
                    resolve( { } );
                }
            }
        } );
    } );
};

module.exports.getJSONDataSync = ( file ) => {
    return JSON.parse( fs.readFileSync( path.join( __dirname + '/../../' + file ) ) );
};

module.exports.writeJSONDataSimple = ( db, identifier, values ) => {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( path.join( __dirname + '/data/' + db + '.json' ), ( error, data ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                let dat = {};
                if ( data.byteLength > 0 ) {
                    dat = JSON.parse( data ) ?? {};
                }
                dat[ identifier ] = values;
                fs.writeFile( path.join( __dirname + '/data/' + db + '.json' ), JSON.stringify( dat ), ( error ) => {
                    if ( error ) {
                        reject( 'Error occurred: Error trace: ' + error );
                    }
                    resolve( true );
                } );
            }
        } );
    } );
};

module.exports.writeJSONData = ( db, data ) => {
    return new Promise( ( resolve, reject ) => {
        fs.writeFile( path.join( __dirname + '/data/' + db + '.json' ), JSON.stringify( data ), ( error ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                resolve( true );
            }
        } );
    } );
};