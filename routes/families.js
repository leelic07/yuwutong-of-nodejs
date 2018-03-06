/**
 * Created by Administrator on 2018/3/7/007.
 */
const router = require('koa-router')();
const controller = require('../controller');
const familiesController = controller.getFamiliesController();

router.prefix('/families');

router.get('/page', familiesController.families);

module.exports = router;