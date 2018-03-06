/**
 * Created by Administrator on 2018/3/6/006.
 */
const router = require('koa-router')();
const controller = require('../controller');
const prisonersController = controller.getPrisonersController();

router.prefix('/prisoners');

router.get('/page', prisonersController.prisoners);

module.exports = router;