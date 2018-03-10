/**
 * Created by Administrator on 2018/3/8/008.
 */
const router = require('koa-router')();
const controller = require('../controller');
const meetingsController = controller.getMeetingsController();

router.prefix('/meetings');

router.get('/page', meetingsController.meetings);

router.post('/authorize', meetingsController.authorize);

router.post('/withdraw', meetingsController.authorize);

module.exports = router;