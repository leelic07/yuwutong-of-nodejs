/**
 * Created by Administrator on 2018/3/1/001.
 */
module.exports = {
    secret: 'learnRestApiwithNickjs',//token密钥
    database: 'mongodb://127.0.0.1:27017/yuwutong',//连接MongoDB的地址
    upload: function (req, file, cb) {
        cb(null, 'public/uploads/excel');
    }
};