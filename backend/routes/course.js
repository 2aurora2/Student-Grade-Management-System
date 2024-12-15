var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

const responseUtil = require("../utils/response");

router.get('/get/info', async (req, res, next) => {
    responseUtil.success(res, {
        name: '数据库系统实现'
    });
});

router.post('/create', async (req, res, next) => {
    let cou_name = req.body.name;
    let cou_credit = req.body.credit;
    let cou_daily_ratio = req.body.daily_ratio;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :id := insert_course(:name, :credit, :daily_ratio); END;`,
            {
                name: {val: cou_name, dir: oracledb.BIND_IN, type: oracledb.STRING},
                credit: {val: cou_credit, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                daily_ratio: {val: cou_daily_ratio, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                id: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
        // 检查是否插入成功
        if (result.outBinds.id !== -1) {
            console.log("插入课程ID: " + result.outBinds.id);
            responseUtil.success(res, {
                id: result.outBinds.id
            });
        } else {
            console.log("插入课程失败");
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

router.post('/delete', async (req, res, next) => {
    let course_id = req.body.course_id;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :flag := delete_course_by_id(:course_id); END;`,
            {
                course_id: {val: course_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                flag: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
        if (result.outBinds.flag === -1) {
            console.log("课程不存在");
        }
        responseUtil.success(res, {});
    } catch (e) {
        console.error(e);
        responseUtil.error(res);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.get('/get', async (req, res, next) => {
    const {name} = req.query;
    var connection = await oracledb.getConnection();
    try {
        // 调用PL/SQL函数
        const result = await connection.execute(
            `BEGIN :result := get_course_class_count(${name ? `'${name}'` : 'NULL'}); END;`,
            {
                result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );
        // 处理游标结果
        const cursor = result.outBinds.result;

        // 读取游标结果
        let courseList = []
        let row;
        while ((row = await cursor.getRow())) {
            courseList.push(row)
        }

        responseUtil.success(res, {
            courseList: courseList
        });
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