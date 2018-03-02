const router = require('koa-router')();
const controller = require('../controller');
const usersController = controller.getUsersController();

router.prefix('/users');

router.get('/', usersController.users);

module.exports = router;
