const sql = require( './backend/db/mysqldb.js' );
const sqlDB = new sql();

const db = require( './backend/db/db.js' );

sqlDB.connect();

sqlDB.resetDB();

setTimeout( () => {
    sqlDB.setupDB();
    
    setTimeout( () => {
        db.writeDataSimple( 'admin', 'email', 'info@janishutz.com', { 'email': 'info@janishutz.com', 'pass': '$2b$05$ElMYWoMjk7567lXkIkee.e.6cxCrWU4gkfuNLB8gmGYLQQPm7gT3O', 'username': 'jhutz' } );
    }, 1000 );

    setTimeout( () => {
        db.writeDataSimple( 'user', 'email', 'info@janishutz.com', { 'email': 'info@janishutz.com', 'pass': '$2b$05$ElMYWoMjk7567lXkIkee.e.6cxCrWU4gkfuNLB8gmGYLQQPm7gT3O', 'name': 'Hutz', 'first_name': 'Janis', 'two_fa': 'enhanced' } );
    }, 1000 );

    setTimeout( () => {
        db.writeDataSimple( 'admin', 'email', 'info@janishutz.com', { 'email': 'info@janishutz.com', 'pass': '$2b$05$ElMYWoMjk7567lXkIkee.e.6cxCrWU4gkfuNLB8gmGYLQQPm7gT3O', 'username': 'jhutz', 'permissions': JSON.stringify( { 'test': true } ), 'two_fa': true } );
    }, 2000 );
}, 1000 );