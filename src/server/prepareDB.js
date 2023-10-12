const db = require( './backend/db/db.js' );

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

db.writeJSONData( 'booked', {} );
db.writeJSONData( 'eventDrafts', {} );
db.writeJSONData( 'events', {} );
db.writeJSONData( 'locations', {} );
db.writeJSONData( 'events', {} );
db.writeJSONData( 'seatplan', {} );
db.writeJSONData( 'tickets', {} );
db.writeJSONData( 'rootAccount', {} );
db.writeJSONData( 'db', {} );

db.saveSettings( {
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