const mysql = require( 'promise-mysql' );

class SQLDB {
    constructor () {
        this.sqlconnection = mysql.createConnection( {
            host: 'janishutz.com',
            port: '3306',
            user: 'janishut_libreeventTest',
            password: '^PVgj&xkaQKmMDCgz&2^aCaYxc7nCS#*%7%',
            connectionLimit: 200
        } );
    }
}

module.exports = SQLDB;