const sql = require( './backend/db/mysqldb.js' );
const sqlDB = new sql();

sqlDB.connect();
// sqlDB.resetDB();
sqlDB.setupDB();