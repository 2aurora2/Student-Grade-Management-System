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

    let insert_count = 0;
    try {
        // 调用 PL/SQL 执行
        for (var i = 0; i < stu_list.length; i++) {
            // 调用 PL/SQL 执行
            const result = await connection.execute(
                `BEGIN :id := insert_student(:name, :campus_id, :major, :grade, :class_id); END;`,
                {
                    name: {val: stu_list[i].name, dir: oracledb.BIND_IN, type: oracledb.STRING},
                    campus_id: {val: stu_list[i].campus_id, dir: oracledb.BIND_IN, type: oracledb.STRING},
                    major: {val: stu_list[i].major, dir: oracledb.BIND_IN, type: oracledb.STRING},
                    grade: {val: stu_list[i].grade, dir: oracledb.BIND_IN, type: oracledb.STRING},
                    class_id: {val: class_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                    id: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
                }
            );
            // 检查是否插入成功
            if (result.outBinds.id !== -1) {
                console.log("插入学生ID: " + result.outBinds.id);
                insert_count = insert_count + 1;
            } else {
                console.log("插入学生失败");
                responseUtil.error(res);
            }
        }
        // 检查是否插入成功
        if (insert_count !== -1) {
            console.log("插入学生数量: " + insert_count);
            responseUtil.success(res, {
                insert_count: insert_count
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

router.post('/delete', async (req, res, next) => {
    let stu_id = req.body.stu_id;
    let class_id = req.body.class_id;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :flag := delete_stu_class_by_id(:stu_id, :class_id); END;`,
            {
                stu_id: {val: stu_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                class_id: {val: class_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                flag: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
        if (result.outBinds.flag === -1) {
            console.log("学生不存在");
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

router.post('/mark', async (req, res, next) => {
    let stu_id = req.body.stu_id;
    let course_id = req.body.course_id;
    let daily_score = req.body.daily_score;
    let exam_score = req.body.exam_score;
    var connection = await oracledb.getConnection();
    try {
        // 调用 PL/SQL 执行
        const result = await connection.execute(
            `BEGIN :flag := add_or_update_stu_cou_score(:stu_id, :course_id, :daily_score, :exam_score); END;`,
            {
                stu_id: {val: stu_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                course_id: {val: course_id, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                daily_score: {val: daily_score, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                exam_score: {val: exam_score, dir: oracledb.BIND_IN, type: oracledb.NUMBER},
                flag: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            }
        );
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

module.exports = router;