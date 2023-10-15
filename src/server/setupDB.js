const db = require( './backend/db/db.js' );

( async () => {
    await db.initDB();
    db.reset();
    console.log( 'DONE' );
} )();