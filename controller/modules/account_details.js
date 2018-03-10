/**
 * Created by Administrator on 2018/3/8/008.
 */
const db = require('../../model');

class AccountDetails {
    constructor() {
    }

    //获取对应id的罪犯账户明细
    async details(ctx, next) {
        // await db.getAccountDetail().create({
        //     id: 1,
        //     account_id: 1,
        //     amount: 5.50,
        //     reason: '购买面包',
        // }, {
        //     id: 2,
        //     account_id: 1,
        //     amount: 3.00,
        //     reason: '购买牛奶'
        // }, {
        //     id: 3,
        //     account_id: 2,
        //     amount: 14.50,
        //     reason: '购买洗发水'
        // }, {
        //     id: 4,
        //     account_id: 3,
        //     amount: 20.50,
        //     reason: '罚款'
        // }, {
        //     id: 5,
        //     account_id: 3,
        //     amount: 10.00,
        //     reason: '奖励'
        // }).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '新增罪犯账户明细成功',
        //             data: {
        //                 details: result
        //             }
        //         }
        //     } else ctx.body = {
        //         code: 500,
        //         msg: '新增罪犯账户明细失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        await db.getAccountDetail().findByAccountId(ctx.request).then(accountDetail => {
            if (accountDetail.length) {
                ctx.body = {
                    code: 200,
                    msg: '查询罪犯账户明细成功',
                    data: {
                        details: accountDetail
                    }
                }
            } else ctx.body = {
                code: 404,
                msg: '未找到账户明细',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new AccountDetails();