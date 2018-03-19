/**
 * Created by Administrator on 2018/3/19/019.
 */
const router = require('koa-router')();
const controller = require('../controller');
const prisonerOrdersController = controller.getPrisonerOrdersController();

router.prefix('/prisoner_orders');

router.get('/processing', prisonerOrdersController.processing);

module.exports = router;