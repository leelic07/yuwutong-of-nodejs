const router = require('koa-router')();
const controller = require('../controller');
const usersController = controller.getUsersController();
const tokenController = controller.getTokenController();

router.prefix('/users');

router.get('/', usersController.users);

router.post('/login', tokenController.authentication);

router.get('/logout', tokenController.logout);

router.post('/resetPwd', usersController.resetPwd);

module.exports = router;
