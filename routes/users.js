const router = require('koa-router')();
const controller = require('../controller');
const usersController = controller.getUsersController();
const tokenController = controller.getTokenController();

router.prefix('/users');

router.get('/', usersController.users);

router.post('/login', tokenController.authentication);

module.exports = router;
