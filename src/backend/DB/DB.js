const mariadb = require('mariadb');
const config = require('./Config/dbconfig.json');

let pool = mariadb.createPool(config);

const getConnection = async () => {
    let conn = null;
    try {
        conn = await pool.getConnection();
    }
    catch (err) {
        console.log(err);
    };

    return conn;
}

module.exports = getConnection;