/**
 * Created by Administrator on 2018/3/1/001.
 */
const router = require('koa-router')();
const controller = require('../controller');
const tokenController = controller.getTokenController();

router.prefix('/authentication');

//获取token
router.post('/', tokenController.authentication);

module.exports = router;