/**
 * Created by Administrator on 2018/3/7/007.
 */
const db = require('../../model');

class Accounts {
    constructor() {
    }

    //获取罪犯账户列表
    async accounts(ctx, next) {
        // await db.getAccounts().create({
        //     id: 1,
        //     prisoner_id: 1,
        //     balance: 99.90
        // }, {
        //     id: 2,
        //     prisoner_id: 2,
        //     balance: 73.98
        // }, {
        //     id: 3,
        //     prisoner_id: 3,
        //     balance: 66.66
        // }).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '新增罪犯账户成功',
        //             data: {
        //                 accounts: result
        //             }
        //         }
        //     } else ctx.body = {
        //         code: 500,
        //         msg: '新增罪犯账户失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let size;
        let accountsList = [];//罪犯账户列表
        let prisonersList = [];//罪犯信息列表
        //获取罪犯账户信息
        await db.getAccounts().findAccounts().then(accounts => {
            if (accounts.length) {
                accountsList = accounts;
            } else ctx.body = {
                code: 404,
                msg: '未找到罪犯账户信息',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
        //获取罪犯信息列表
        await db.getPrisoners().findPage(ctx.request).then(async prisoners => {
            if (prisoners.length) {
                await db.getPrisoners().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(500, err.message));
                prisonersList = prisoners;
            } else ctx.body = {
                code: 404,
                msg: '未找到罪犯信息',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
        //将罪犯账户信息和罪犯信息合并在一起
        prisonersList.forEach(prisoner => {
            let account = accountsList.find(account => account.prisonerId === prisoner.id);
            Object.assign(prisoner, account);
        });
        ctx.body = {
            code: 200,
            msg: '查询罪犯账户成功',
            data: {
                prisoners: prisonersList,
                prisonersSize: size ? size : 0
            }
        }
    }
}

module.exports = new Accounts();