require('dotenv').config();

module.exports = {
    oracle: {
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNECT_STRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0
    }
}