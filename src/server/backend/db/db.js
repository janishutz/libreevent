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

const dbRef = { 'user': 'libreevent_users', 'admin': 'libreevent_admin', 'order': 'libreevent_orders', 'users': 'libreevent_users', 'orders': 'libreevent_orders', 'temp': 'libreevent_temp' };

const letters = [ ',', '{' ];

let dbh;

if ( settings.db === 'mysql' ) {
    const dbsoft = require( './mysqldb.js' );
    dbh = new dbsoft();
    dbh.connect();
} else {
    const dbsoft = require( './jsondb.js' );
    dbh = new dbsoft();
    dbh.connect();
}

module.exports.initDB = () => {
    ( async() =>  {
        console.log( '[ DB ] Setting up...' );
        await dbh.setupDB();
        console.log( '[ DB ] Setting up complete!' );
    } )();
};

module.exports.getDataSimple = ( db, column, searchQuery ) => {
    return new Promise( ( resolve, reject ) => {
        dbh.query( { 'command': 'getFilteredData', 'property': column, 'searchQuery': searchQuery }, dbRef[ db ] ).then( data => {
            resolve( data );
        } ).catch( error => {
            reject( error );
        } );
    } );
};

module.exports.getData = ( db ) => {
    return new Promise( ( resolve, reject ) => {
        dbh.query( { 'command': 'getAllData' }, dbRef[ db ] ).then( data => {
            resolve( data );
        } ).catch( error => {
            reject( error );
        } );
    } );
};

module.exports.writeDataSimple = ( db, column, searchQuery, data ) => {
    return new Promise( ( resolve, reject ) => {
        dbh.query( { 'command': 'checkDataAvailability', 'property': column, 'searchQuery': searchQuery }, dbRef[ db ] ).then( res => {
            if ( res.length > 0 ) {
                dbh.query( { 'command': 'updateData', 'property': column, 'searchQuery': searchQuery, 'newValues': data }, dbRef[ db ] ).then( dat => {
                    resolve( dat );
                } ).catch( error => {
                    reject( error );
                } );
            } else {
                dbh.query( { 'command': 'addData', 'data': data }, dbRef[ db ] ).then( dat => {
                    resolve( dat );
                } ).catch( error => {
                    reject( error );
                } );
            }
        } ).catch( error => {
            reject( error );
        } );
    } );
};

module.exports.deleteDataSimple = ( db, column, searchQuery ) => {
    return new Promise( ( resolve, reject ) => {
        dbh.query( { 'command': 'deleteData', 'property': column, 'searchQuery': searchQuery }, dbRef[ db ] ).then( dat => {
            resolve( dat );
        } ).catch( error => {
            reject( error );
        } );
    } );
};

module.exports.checkDataAvailability = ( db, column, searchQuery ) => {
    return new Promise( ( resolve, reject ) => {
        dbh.query( { 'command': 'checkDataAvailability', 'property': column, 'searchQuery': searchQuery }, dbRef[ db ] ).then( res => {
            if ( res.length > 0 ) {
                resolve( true );
            } else {
                resolve( false );
            }
        } ).catch( error => {
            reject( error );
        } );
    } );
};


module.exports.getJSONData = ( file ) => {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( path.join( __dirname + '/../../data/' + file + '.json' ), ( error, data ) => {
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
        fs.readFile( path.join( __dirname + '/../../data/' + file + '.json' ), ( error, data ) => {
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
        fs.readFile( path.join( __dirname + '/../../data/' + db + '.json' ), ( error, data ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                let dat = {};
                if ( data.byteLength > 0 ) {
                    dat = JSON.parse( data ) ?? {};
                }
                dat[ identifier ] = values;
                fs.writeFile( path.join( __dirname + '/../../data/' + db + '.json' ), JSON.stringify( dat ), ( error ) => {
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
        fs.writeFile( path.join( __dirname + '/../../data/' + db + '.json' ), JSON.stringify( data ), ( error ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                resolve( true );
            }
        } );
    } );
};

module.exports.deleteJSONDataSimple = ( db, identifier ) => {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( path.join( __dirname + '/../../data/' + db + '.json' ), ( error, data ) => {
            if ( error ) {
                reject( 'Error occurred: Error trace: ' + error );
            } else {
                let dat = {};
                if ( data.byteLength > 0 ) {
                    dat = JSON.parse( data ) ?? {};
                }
                delete dat[ identifier ];
                fs.writeFile( path.join( __dirname + '/../../data/' + db + '.json' ), JSON.stringify( dat ), ( error ) => {
                    if ( error ) {
                        reject( 'Error occurred: Error trace: ' + error );
                    }
                    resolve( true );
                } );
            }
        } );
    } );
};

module.exports.saveSettings = ( settings ) => {
    const settingsString = JSON.stringify( settings );
    let settingsToSave = '';
    for ( let letter in settingsString ) {
        if ( letters.includes( settingsString[ letter ] ) ) {
            settingsToSave += settingsString[ letter ] + '\n\t';
        } else if ( settingsString[ letter ] === '}' ) {
            settingsToSave += '\n' + settingsString[ letter ];
        } else {
            settingsToSave += settingsString[ letter ];
        }
    }
    fs.writeFileSync( path.join( __dirname + '/../../config/settings.config.json' ), settingsToSave );
};

const gc = () => {
    // this function acts as the database garbage collector. TicketTimeout can be changed from the GUI.
    this.getData( 'temp' ).then( tempData => {
        let data = tempData;
        console.info( '[ DB ] Garbage Collecting' );
        for ( let item in data ) {
            if ( new Date( data[ item ][ 'timestamp' ] ).getTime() + ( parseInt( settings.ticketTimeout ) * 1000 ) > new Date().getTime() ) {
                delete data[ item ];
                console.debug( '[ DB ] Garbage collected a session' );
            }
        }
    } );
};

/*
    Here, GC-Duty is scheduled to run every so often (defined in settings.config.json file, no GUI setting available.
    If you are a developer and are thinking about adding a GUI setting for this, please consider that this is a
    advanced setting and many people might not understand what it changes. The config file is mentioned in the 
    "advanced settings" section of the admin panel documentation where all the available settings in the config file
    are explained in some detail.)
*/
setInterval( () => {
    gc();
}, parseInt( settings.gcInterval ) * 1000 );