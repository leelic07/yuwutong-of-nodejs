/**
 * Created by Administrator on 2018/3/6/006.
 */
const db = require('../../model');

class Prisoners {
    constructor() {
    }

    //获取服刑人员信息列表
    async prisoners(ctx, next) {
        // await db.getPrisoners().create({
        //     id: 1,
        //     prisoner_number: '410000',
        //     name: '王世充',
        //     gender: '男',
        //     crimes: '强奸',
        //     additional_punishment: '剥夺政治权利',
        //     original_sentence: '强奸罪',
        //     jail_id: 1,
        //     prison_term_started_at: 1399935986349,
        //     prisoner_term_ended_at: 1499935986349,
        //     prison_area: '一监区'
        // }, {
        //     id: 2,
        //     prisoner_number: '410001',
        //     name: '蔡安阳',
        //     gender: '男',
        //     crimes: '偷窃',
        //     additional_punishment: '剥夺政治权利',
        //     original_sentence: '偷窃罪',
        //     jail_id: 1,
        //     prison_term_started_at: 1399935986349,
        //     prisoner_term_ended_at: 1499935986349,
        //     prison_area: '二监区'
        // }, {
        //     id: 3,
        //     prisoner_number: '410002',
        //     name: '张小明',
        //     gender: '男',
        //     crimes: '抢劫',
        //     additional_punishment: '剥夺政治权利',
        //     original_sentence: '抢劫罪',
        //     jail_id: 1,
        //     prison_term_started_at: 1399935986349,
        //     prisoner_term_ended_at: 1499935986349,
        //     prison_area: '二监区'
        // }).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '新增服刑人员成功',
        //             data: ''
        //         }
        //     } else ctx.body = {
        //         code: 500,
        //         msg: '新增服刑人员失败',
        //         data: ''
        //     }
        // }).catch(err => ctx.throw(err.status || 500, err.message));

        let req = ctx.request.query;
        let size;//服刑人员信息列表的总记录数
        let condition = {};
        req.name && (condition.name = req.name);
        req.prisonerNumber && (condition.prison_number = req.prisonerNumber);
        condition.jail_id = ctx.request.user.jail_id;
        await db.getPrisoners().findPage(condition, {}, {
            page: req.page,
            rows: req.rows
        }).then(async prisoners => {
            if (prisoners.length) {
                await db.getPrisoners().findTotal().then(total => size = total).catch(err => ctx.throw(err.status || 500, err.message));
                ctx.body = {
                    code: 200,
                    msg: '查询服刑人员信息成功',
                    data: {
                        prisoners: prisoners,
                        prisonersSize: size ? size : 0
                    }
                }
            } else ctx.body = {
                code: 500,
                msg: '查询服刑人员列表失败',
                data: ''
            }
        }).catch(err => ctx.throw(err.status || 500, err.message));
    }
}

module.exports = new Prisoners();
