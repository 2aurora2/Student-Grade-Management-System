var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

const responseUtil = require("../utils/response");

router.post('/add', async (req, res, next) => {
    let stu_name = req.body.name;
    let stu_campus_id = req.body.campus_id;
    let stu_major = req.body.major;
    let stu_grade = req.body.grade;
    let class_id = req.body.class_id;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :id := insert_student(:name, :campus_id, :major, :grade, :class_id); END;`,
            {
                name: {val: stu_name, dir: oracledb.BIND_IN, type: oracledb.STRING},
                campus_id: {val: stu_campus_id, dir: oracledb.BIND_IN, type: oracledb.STRING},
                major: {val: stu_major, dir: oracledb.BIND_IN, type: oracledb.STRING},
                grade: {val: stu_grade, dir: oracledb.BIND_IN, type: oracledb.STRING},
                class_id: {val: class_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                id: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
        // 检查是否插入成功
        if (result.outBinds.id !== -1) {
            console.log("插入学生ID: " + result.outBinds.id);
            responseUtil.success(res, {
                id: result.outBinds.id
            });
        } else {
            console.log("插入学生失败");
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

router.post('/upload', async (req, res, next) => {
    let stu_list = req.body.stu_list;
    let class_id = req.body.class_id;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :insert_count := insert_students(:stu_list, :class_id); END;`,
            {
                stu_list: {val: stu_list, dir: oracledb.BIND_IN, type: oracledb.ARRAY, maxArrayLength: stu_list.length},
                class_id: {val: class_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                insert_count: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
        // 检查是否插入成功
        if (result.outBinds.insert_count !== -1) {
            console.log("插入学生数量 " + result.outBinds.insert_count);
            responseUtil.success(res, {
                insert_count: result.outBinds.insert_count
            });
        } else {
            console.log("插入学生失败");
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