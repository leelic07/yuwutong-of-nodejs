/**
 * Created by Administrator on 2018/3/14/014.
 */
/**
 * Created by Administrator on 2018/3/14/014.
 */
const router = require('koa-router')();
const controller = require('../controller');
const util = require('../util');
const ordersController = controller.getOrdersController();

router.prefix('/orders');

router.get('/page', ordersController.page);

router.get('/description', ordersController.description);

// router.post('/add', util.ordersController, itemsController.add);

// router.post('/delete', ordersController.delete);

module.exports = router;