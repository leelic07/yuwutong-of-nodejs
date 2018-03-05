/**
 * Created by Administrator on 2018/3/6/006.
 */
const router = require('koa-router')();
const controller = require('../controller');
const registrationsController = controller.getRegistrationsController();

// router.prefix('registrations');

router.get('/registrations', registrationsController.registrations);

module.exports = router;