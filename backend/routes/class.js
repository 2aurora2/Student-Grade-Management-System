var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

const responseUtil = require("../utils/response");

router.post('/create', async (req, res, next) => {
    let cls_name = req.body.name;
    let cls_capacity = req.body.capacity;
    let course_id = req.body.course_id;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :id := insert_class(:name, :capacity, :course_id); END;`,
            {
                name: {val: cls_name, dir: oracledb.BIND_IN, type: oracledb.STRING},
                capacity: {val: cls_capacity, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                course_id: {val: course_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                id: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
        // 检查是否插入成功
        if (result.outBinds.id !== -1) {
            console.log("插入班级ID: " + result.outBinds.id);
            responseUtil.success(res, {
                id: result.outBinds.id
            });
        } else {
            console.log("插入班级失败");
            responseUtil.error(res);
        }
    } catch (e) {
        console.error(e);
        responseUtil.error(res);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;