/**
 * Created by Administrator on 2018/3/11 0011.
 */
const multer = require('koa-multer');
// const md5 = require('md5');

let storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: function (req, file, cb) {//上传文件的保存地址配置
        let fileFormat = (file.originalname).split(".");
        if (fileFormat[fileFormat.length - 1] === 'xls') {
            cb(null, 'public/uploads/excel');
        } else cb(null, 'public/uploads/images');
    },
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
        // let fileFormat = (file.originalname).split(".");
        // cb(null, file.fieldname + '-' + md5(file) + "." + fileFormat[fileFormat.length - 1]);
        cb(null, file.originalname);
    }
});

//添加配置文件到multer对象。
let upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
});
//导出对象
module.exports = upload;