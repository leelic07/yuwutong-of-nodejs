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
        //     prison_term_ended_at: 1499935986349,
        //     prison_area: '一监区',
        //     families: []
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
        //     prison_term_ended_at: 1499935986349,
        //     prison_area: '二监区',
        //     families: []
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
        //     prison_term_ended_at: 1499935986349,
        //     prison_area: '二监区',
        //     families: []
        // }).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '新增服刑人员成功',
        //             data: result
        //         }
        //     } else ctx.body = {
        //         code: 500,
        //         msg: '新增服刑人员失败',
        //         data: ''
        //     }
        // }).catch(err => ctx.throw(err.status || 500, err.message));

        let size;//服刑人员信息列表的总记录数
        let prisonersList = [];//罪犯信息列表
        let familiesList = [];//家属信息列表
        await db.getPrisoners().findPage(ctx.request).then(async prisoners => {
            if (prisoners.length) {
                await db.getPrisoners().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(err.status || 500, err.message));
                prisonersList = prisoners;
            } else ctx.body = {
                code: 404,
                msg: '未找到服刑人员信息',
                data: {}
            }
        }).catch(err => ctx.throw(err.status || 500, err.message));
        //查询家属信息列表
        await db.getFamilies().find().then(families => {
            if (families.length) {
                familiesList = families;
            } else ctx.body = {
                code: 404,
                msg: '未找到家属信息',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
        //将对应相同的罪犯的家属信息加入到罪犯列表当中
        prisonersList.forEach(prisoner => {
            prisoner.families = familiesList.filter(family => family.prisonerId === prisoner.id);
        });
        ctx.body = {
            code: 200,
            msg: '查询服刑人员信息成功',
            data: {
                prisoners: prisonersList,
                prisonersSize: size ? size : 0
            }
        }
    }
}

module.exports = new Prisoners();
