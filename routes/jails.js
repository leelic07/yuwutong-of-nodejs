/**
 * Created by Administrator on 2018/3/14/014.
 */
const router = require('koa-router')();
const controller = require('../controller');
const util = require('../util');
const jailsController = controller.getJailsController();

router.prefix('/jails');

router.get('/index', jailsController.index);

router.post('/update', util.fileuploads.single('file'), jailsController.update);

module.exports = router;