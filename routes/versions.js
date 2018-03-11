/**
 * Created by Administrator on 2018/3/11 0011.
 */
const router = require('koa-router')();
const controller = require('../controller');
const versionsController = controller.getVersionsController();

router.prefix('/versions');

router.get('/page', versionsController.versions);

router.post('/update', versionsController.update);

module.exports = router;