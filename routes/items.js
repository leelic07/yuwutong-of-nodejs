/**
 * Created by Administrator on 2018/3/14/014.
 */
const router = require('koa-router')();
const controller = require('../controller');
const util = require('../util');
const itemsController = controller.getItemsController();

router.prefix('/items');

router.get('/page', itemsController.page);

router.get('/description', itemsController.description);

router.post('/add', util.fileuploads.single('file'), itemsController.add);

router.post('/delete', itemsController.delete);

module.exports = router;