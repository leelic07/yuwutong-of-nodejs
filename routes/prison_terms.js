/**
 * Created by Administrator on 2018/3/13/013.
 */
const router = require('koa-router')();
const controller = require('../controller');
const prisonTermsController = controller.getPrisonTermsController();

router.prefix('/prison_terms');

router.get('/processing', prisonTermsController.processing);

module.exports = router;