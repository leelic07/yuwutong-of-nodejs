/**
 * Created by Administrator on 2018/3/5/005.
 */
const db = require('../../model');

class Meetings {
    constructor() {
    }

    //获取家属注册信息
    async meetings(ctx, next) {
        // await db.getMeetings().createMeetings({
        //     id: 1,
        //     terminal_id: 1,
        //     family_id: 1,
        //     meeting_time: new Date('2018-04-07T07:56:39.123Z'),
        //     name: '丁禾',
        //     prisoner_number: '410000',
        //     uuid: '43012219898764345x'
        //     // registrations: {
        //     //     id: 5,
        //     //     jail_id: 1,//监狱id
        //     //     name: '丁禾',//家属名称
        //     //     phone: '13672645374',//联系电话
        //     //     uuid: '43012219898764345x',
        //     //     prisoner_number: '410000',//犯人编号
        //     //     relationship: '父子',//关系
        //     //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     //     remarks: '',//备注
        //     //     gender: '男'//性别
        //     // }
        // }, {
        //     id: 2,
        //     terminal_id: 2,
        //     family_id: 2,
        //     meeting_time: new Date('2018-05-07T07:56:39.123Z'),
        //     name: '萧骁',//家属名称
        //     prisoner_number: '410001',//犯人编号
        //     uuid: '43012219818763455x'
        //     // registrations: {
        //     //     id: 6,
        //     //     jail_id: 1,//监狱id
        //     //     name: '萧骁',//家属名称
        //     //     phone: '13677845274',//联系电话
        //     //     uuid: '43012219818763455x',
        //     //     prisoner_number: '410001',//犯人编号
        //     //     relationship: '母子',//关系
        //     //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     //     remarks: '',//备注
        //     //     gender: '女'//性别
        //     // }
        // }, {
        //     id: 3,
        //     terminal_id: 3,
        //     family_id: 3,
        //     meeting_time: new Date('2018-06-07T07:56:39.123Z'),
        //     name: '罗俊',//家属名称
        //     prisoner_number: '410001',//犯人编号
        //     uuid: '430122198987689412',
        //     // registrations: {
        //     //     id: 7,
        //     //     jail_id: 1,//监狱id
        //     //     name: '罗俊',//家属名称
        //     //     phone: '13672095374',//联系电话
        //     //     uuid: '430122198987689412',
        //     //     prisoner_number: '410001',//犯人编号
        //     //     relationship: '兄弟',//关系
        //     //     status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        //     //     remarks: '',//备注
        //     //     gender: '男'//性别
        //     // }
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加家属会见信息成功',
        //         data: result
        //     }; else ctx.body = {
        //         code: 500,
        //         msg: '添加家属会见信息失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));
        //
        // // await db.getMeetings().update({id: 3}, {
        // //     registrations: {
        // //         id: 7,
        // //         jail_id: 1,//监狱id
        // //         name: '罗俊',//家属名称
        // //         phone: '13672095374',//联系电话
        // //         uuid: '430122198987689412',
        // //         prisoner_number: '410001',//犯人编号
        // //         relationship: '兄弟',//关系
        // //         status: 'PENDING',//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
        // //         remarks: '',//备注
        // //         gender: '男'//性别
        // //     }
        // // }, (e, d) => {
        // //     !e && (ctx.body = {
        // //         code: 200,
        // //         data: {
        // //             result: d
        // //         }
        // //     });
        // // });

        let size;//家属会见列表的总记录数
        let meetingsList = [];//家属会见信息
        let familiesList = [];//家属信息列表
        let failure = {//查询家属会见失败提示信息
            code: 404,
            msg: '未找到家属会见信息',
            data: {
                meetings: [],
                total: 0
            }
        };
        await db.getMeetings().findPage(ctx.request).then(async meetings => {
            if (meetings.length) {
                await db.getMeetings().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(500, err.message));
                meetingsList = meetings;
                ctx.body = {
                    code: 200,
                    msg: '查询家属会见信息成功',
                    data: {
                        meetings: meetingsList,
                        total: size ? size : 0
                    }
                };
            } else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //查找家属信息列表
        await db.getFamilies().findByNameOrUuid(ctx.request).then(families => {
            if (families.length) familiesList = families;
            else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //将对应地家属信息加到家属会见信息当中
        let family;
        meetingsList.forEach(meeting => {
            family = familiesList.find(family => meeting.familyId === family.id);
            family && Object.assign(meeting, {
                phone: family.phone,
                relationship: family.relationship
            });
        });
        meetingsList.length && (ctx.body = {
            code: 200,
            msg: '查询家属会见信息成功',
            data: {
                meetings: meetingsList,
                total: size ? size : 0
            }
        }) || (ctx.body = failure);
    }

    //授权家属注册信息
    async authorize(ctx, next) {
        await db.getMeetings().updateById(ctx.request).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '家属会见信息授权成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '家属会见信息授权失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module
    .exports = new Meetings();