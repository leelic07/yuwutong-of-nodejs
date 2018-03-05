/**
 * Created by Administrator on 2018/3/5/005.
 */
const db = require('../../model');

class Registrations {
    constructor() {
    }

    //获取家属注册信息
    async registrations(ctx, next) {
        // ctx.body = {
        //     code: 200,
        //     msg: 'registrations',
        //     result: ''
        // }
        // await db.getRegistrations().create({
        //     jail_id: 1,//监狱id
        //     name: '三毛',//家属名称
        //     phone: '18654372987',//联系电话
        //     uuid: '1',
        //     prisoner_number: '4501110',//犯人编号
        //     relationship: '父子',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '注册信息',//备注
        //     gender: '男'//性别
        // }, {
        //     jail_id: 2,//监狱id
        //     name: '四毛',//家属名称
        //     phone: '18654372977',//联系电话
        //     uuid: '2',
        //     prisoner_number: '4501111',//犯人编号
        //     relationship: '母子',//关系
        //     status: 'PASSED',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '通过注册信息',//备注
        //     gender: '女'//性别
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加家属注册信息成功',
        //         result: ''
        //     };
        //     else ctx.body = {
        //         code: 500,
        //         msg: '添加家属注册信息失败',
        //         result: ''
        //     }
        // }).catch(err => ctx.throw(err.status | 500, '添加家属注册信息失败'));

        let size;//家属注册列表的总数据条数
        await db.getRegistrations().findPage({}, {}, ctx.request.query).then(async registrations => {
            if (registrations.length) {
                await db.getRegistrations().findTotal().then(total => size = total).catch(err => ctx.throw(err.status | 500, "查询家属注册列表失败"));
                ctx.body = {
                    code: 200,
                    msg: '查询家属注册列表成功',
                    data: {
                        registrations: registrations,
                        registrationsSize: size
                    }
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg: '未找到家属注册信息',
                    data: {
                        registrations: [],
                        registrationsSize: 0
                    }
                }
            }
        }).catch(err => {
            ctx.throw(err.status | 500, '查询家属注册列表失败')
        });
    }
}

module.exports = new Registrations();