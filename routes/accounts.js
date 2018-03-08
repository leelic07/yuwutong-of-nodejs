/**
 * Created by Administrator on 2018/3/7/007.
 */
const router = require('koa-router')();
const controller = require('../controller');
const accountsController = controller.getAccountsController();
const accountDetailsController = controller.getAccountDetailsController();
router.prefix('/accounts');

router.get('/page', accountsController.accounts);

router.get('/details', accountDetailsController.details);

module.exports = router;