/**
 * Created by Administrator on 2018/3/11 0011.
 */
const router = require('koa-router')();
const controller = require('../controller');
const terminalsController = controller.getTerminalsController();

router.prefix('/terminals');

router.get('/page', terminalsController.terminals);

module.exports = router;