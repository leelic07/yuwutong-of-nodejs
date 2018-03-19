/**
 * Created by Administrator on 2018/3/19/019.
 */
const router = require('koa-router')();
const controller = require('../controller');
const prisonRewardController = controller.getPrisonRewardController();

router.prefix('/prisoner_reward_punishments');

router.get('/processing', prisonRewardController.processing);

module.exports = router;