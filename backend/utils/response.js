const response = {
    success(res, data, message = '操作成功') {
        res.send({
            code: 200,
            message: message,
            data
        });
    },
    error(res, message = '操作失败', code = 400) {
        res.status(code);
        res.send({
            code: code,
            message: message,
            data: null
        });
    }
};

module.exports = response;