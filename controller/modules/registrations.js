/**
 * Created by Administrator on 2018/3/5/005.
 */
const db = require('../../model');

class Registrations {
    constructor() {
    }

    //获取家属注册信息
    async registrations(ctx, next) {
        // await db.getRegistrations().createRegistrations({
        //     id: 1,
        //     jail_id: 1,//监狱id
        //     name: '王大锤',//家属名称
        //     phone: '18654372987',//联系电话
        //     uuid: '42013419841212873x',
        //     prisoner_number: '410000',//犯人编号
        //     relationship: '父子',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '男'//性别
        // }, {
        //     id: 2,
        //     jail_id: 1,//监狱id
        //     name: '宁红',//家属名称
        //     phone: '18654372977',//联系电话
        //     uuid: '42013419751223431x',
        //     prisoner_number: '410001',//犯人编号
        //     relationship: '母子',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '女'//性别
        // }, {
        //     id: 3,
        //     jail_id: 1,//监狱id
        //     name: '李黎',//家属名称
        //     phone: '18654372977',//联系电话
        //     uuid: '42013419751223431x',
        //     prisoner_number: '410001',//犯人编号
        //     relationship: '兄弟',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '男'//性别
        // }, {
        //     id: 4,
        //     jail_id: 2,//监狱id
        //     name: '欧阳武',//家属名称
        //     phone: '18678372977',//联系电话
        //     uuid: '420134198507234393',
        //     prisoner_number: '410003',//犯人编号
        //     relationship: '兄弟',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '男'//性别
        // }, {
        //     id: 5,
        //     jail_id: 1,//监狱id
        //     name: '丁禾',//家属名称
        //     phone: '13672645374',//联系电话
        //     uuid: '43012219898764345x',
        //     prisoner_number: '410000',//犯人编号
        //     relationship: '父子',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '男'//性别
        // }, {
        //     id: 6,
        //     jail_id: 1,//监狱id
        //     name: '萧骁',//家属名称
        //     phone: '13677845274',//联系电话
        //     uuid: '43012219818763455x',
        //     prisoner_number: '410001',//犯人编号
        //     relationship: '母子',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '女'//性别
        // }, {
        //     id: 7,
        //     jail_id: 1,//监狱id
        //     name: '罗俊',//家属名称
        //     phone: '13672095374',//联系电话
        //     uuid: '430122198987689412',
        //     prisoner_number: '410001',//犯人编号
        //     relationship: '兄弟',//关系
        //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     remarks: '',//备注
        //     gender: '男'//性别
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加家属注册信息成功',
        //         data: result
        //     };
        //     else ctx.body = {
        //         code: 500,
        //         msg: '添加家属注册信息失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let size;//家属注册列表的总记录数
        await db.getRegistrations().findPage(ctx.request).then(async registrations => {
            if (registrations.length) {
                await db.getRegistrations().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(500, err.message));
                ctx.body = {
                    code: 200,
                    msg: '查询家属注册列表成功',
                    data: {
                        registrations: registrations,
                        total: size ? size : 0
                    }
                }
            } else ctx.body = {
                code: 404,
                msg: '未找到家属注册信息',
                data: {
                    registrations: [],
                    total: 0
                }
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //授权家属注册信息
    async authorize(ctx, next) {
        await db.getRegistrations().update(ctx.request).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '家属注册信息授权成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '家属注册信息授权失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new Registrations();