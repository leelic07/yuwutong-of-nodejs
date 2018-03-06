/**
 * Created by Administrator on 2018/3/5/005.
 */
const router = require('koa-router')();
const controller = require('../controller');
const registrationsController = controller.getRegistrationsController();

router.prefix('/registrations');

router.get('/', registrationsController.registrations);

module.exports = router;