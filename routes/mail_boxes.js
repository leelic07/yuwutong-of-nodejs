/**
 * Created by Administrator on 2018/3/10 0010.
 */
const router = require('koa-router')();
const controller = require('../controller');
const mailBoxesController = controller.getMailBoxesController();

router.prefix('/mailboxes');

router.get('/page', mailBoxesController.mailboxes);

router.get('/jailReply', mailBoxesController.jailReply);

router.post('/reply', mailBoxesController.reply);

module.exports = router;