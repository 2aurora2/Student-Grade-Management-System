const oracledb = require('oracledb');
const config = require('./config').oracle;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function init() {
    try {
        // Create OracleDB Connection Pool
        await oracledb.createPool({
            user: config.user,
            password: config.password,
            connectString: config.connectString,
            poolMin: config.poolMin,
            poolMax: config.poolMax,
            poolIncrement: config.poolIncrement
        });

        // Test OracleDB Connection
        let conn;
        try {
            conn = await oracledb.getConnection();
            const result = await conn.execute(
                `DECLARE
                    info VARCHAR2(40) := 'OracleDB Connection Test Success!';
                BEGIN
                    :ret := info;
                END;`,
                {
                    ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 }
                }
            );
            console.log(result.outBinds.ret);
        } catch (err) {
            console.error("OracleDB Connection Test Error: " + err.message);
        } finally {
            if (conn) {
                await conn.close();
            }
        }
    } catch (err) {
        console.error("OracleDB Connection Pool Created Error: " + err.message);
    }
}

init();