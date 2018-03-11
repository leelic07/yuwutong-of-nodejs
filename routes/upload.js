/**
 * Created by Administrator on 2018/3/11 0011.
 */
const router = require('koa-router')();
const util = require('../util');
const controller = require('../controller');
const uploadController = controller.getUploadController();

router.prefix('/upload');

router.post('/uploadfile', util.fileuploads.single('file'), uploadController.upload);

module.exports = router;