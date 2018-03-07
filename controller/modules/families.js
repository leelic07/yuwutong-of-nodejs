/**
 * Created by Administrator on 2018/3/7/007.
 */
const db = require('../../model');

class Families {
    constructor() {
    }

    //获取家属信息列表
    async families(ctx, next) {
        // await db.getFamilies().create({
        //     id: 1,
        //     prisoner_id: 1,
        //     name: '丁禾',
        //     uuid: '43012219898764345x',
        //     phone: '13672645374',
        //     relationship: '父子',
        //     image_url: '/upload/images/head/ding.png',
        //     balance: 43.00,
        //     last_trade_no: '123654',
        //     prisoners: 1
        // }, {
        //     id: 2,
        //     prisoner_id: 2,
        //     name: '萧骁',
        //     uuid: '43012219818763455x',
        //     phone: '13677845274',
        //     relationship: '母子',
        //     image_url: '/upload/images/head/xiao.png',
        //     balance: 91.50,
        //     last_trade_no: '192654',
        //     prisoners: 2
        // }, {
        //     id: 3,
        //     prisoner_id: 3,
        //     name: '罗俊',
        //     uuid: '430122198987689412',
        //     phone: '13672095374',
        //     relationship: '兄弟',
        //     image_url: '/upload/images/head/luo.png',
        //     balance: 11.00,
        //     last_trade_no: '185904',
        //     prisoners: 3
        // }).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '添加罪犯家属信息成功',
        //             data: result
        //         }
        //     } else {
        //         ctx.body = {
        //             code: 500,
        //             msg: '添加罪犯家属信息失败',
        //             data: ''
        //         }
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let size;//服刑人员信息列表的总记录数
        let familiesList = [];//罪犯家属列表
        let prisonersList = [];//罪犯列表
        //查找罪犯家属列表
        await db.getFamilies().findPage(ctx.request).then(async families => {
            if (families.length) {
                await db.getFamilies().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(err.status || 500, err.message));
                familiesList = families;
            } else ctx.body = {
                code: 404,
                msg: '未找到罪犯家属信息',
                data: ''
            }
        }).catch(err => ctx.throw(err.status || 500, err.message));
        //查找罪犯列表
        await db.getPrisoners().find(ctx.request).then(prisoners => {
            if (prisoners.length) prisonersList = prisoners;
            else ctx.body = {
                code: 404,
                msg: '未找到罪犯信息',
                data: ''
            }
        }).catch(err => ctx.throw(500, err.message));
        //寻找prisonerId对应的罪犯信息
        familiesList.forEach(fam => {
            fam.prisoners = prisonersList.find(pri => fam.prisonerId === pri.id);
        });
        if (familiesList.length) {//查询到家属信息列表
            ctx.body = {
                code: 200,
                msg: '查询家属信息成功',
                data: {
                    families: familiesList,
                    familiesSize: size ? size : 0
                }
            }
        } else ctx.body = {//未查询到家属信息列表
            code: 404,
            msg: '未找到家属信息',
            data: {
                families: [],
                familiesSize: 0
            }
        }
    }
}

module.exports = new Families();