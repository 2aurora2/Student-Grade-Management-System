var express = require('express');
var router = express.Router();

const responseUtil = require("../utils/response");

router.get('/get/info', async (req, res, next) => {
    responseUtil.success(res, {
        name: '数据库系统实现'
    });
});

module.exports = router;