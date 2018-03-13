/**
 * Created by Administrator on 2018/3/11 0011.
 */
const router = require('koa-router')();
const controller = require('../controller');
const terminalsController = controller.getTerminalsController();

router.prefix('/terminals');

router.get('/page', terminalsController.terminals);

router.post('/edit', terminalsController.edit);

router.post('/add', terminalsController.add);

module.exports = router;