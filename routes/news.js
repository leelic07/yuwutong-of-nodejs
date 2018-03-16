/**
 * Created by Administrator on 2018/3/16/016.
 */
const router = require('koa-router')();
const controller = require('../controller');
const util = require('../util');
const newsController = controller.getNewsController();

router.prefix('/news');

router.get('/page', newsController.page);

router.post('/add', util.fileuploads.single('file'), newsController.add);

router.post('/delete', newsController.delete);

module.exports = router;