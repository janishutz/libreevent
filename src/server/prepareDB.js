const fs = require( 'fs' );
const path = require( 'path' );

const letters = [ ',', '{' ];

const writeJSONData = ( db, data ) => {
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

const saveSettings = ( settings ) => {
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
    fs.writeFileSync( path.join( __dirname + '/config/settings.config.json' ), settingsToSave );
};

console.log( `

 _ _ _                                   _   
| (_) |                                 | |  
| |_| |__  _ __ ___  _____   _____ _ __ | |_ 
| | | '_ \\| '__/ _ \\/ _ \\ \\ / / _ \\ '_ \\| __|
| | | |_) | | |  __/  __/\\ V /  __/ | | | |_ 
|_|_|_.__/|_|  \\___|\\___| \\_/ \\___|_| |_|\\__|
                                             
                                             


    -------------------------------
    
    ==> Resetting DBs to prepare for build

` );

writeJSONData( 'booked', {} );
writeJSONData( 'eventDrafts', {} );
writeJSONData( 'events', {} );
writeJSONData( 'locations', {} );
writeJSONData( 'events', {} );
writeJSONData( 'seatplan', {} );
writeJSONData( 'tickets', {} );
writeJSONData( 'rootAccount', {} );
writeJSONData( 'db', {} );

saveSettings( {
    'init': false,
    'setupDone': false,
    'twoFA': 'allow',
    'twoFAMode': 'simple',
    'db': 'mysql',
    'payments': 'stripe',
    'name': 'libreevent',
    'yourDomain': '',
    'mailSender': '',
    'maxTickets': 10,
    'currency': 'USD',
    'gcInterval': 300,
    'ticketTimeout': 900,
    'startPage': 'default',
    'version': '1.0.0'
} );

console.log( '  ==> Done!\n\n' );