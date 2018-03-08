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
        //     meeting_time: new Date('2018-04-07T07:56:39.123Z')
        // }, {
        //     id: 2,
        //     terminal_id: 2,
        //     family_id: 2,
        //     meeting_time: new Date('2018-05-07T07:56:39.123Z')
        // }, {
        //     id: 3,
        //     terminal_id: 3,
        //     family_id: 3,
        //     meeting_time: new Date('2018-06-07T07:56:39.123Z')
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

        let size;//家属会见列表的总记录数
        let meetingsList = [];//家属会见信息
        let familiesList = [];//家属信息列表
        let prisonersList = [];//罪犯信息列表
        let failure = {//查询家属会见失败提示信息
            code: 404,
            msg: '未找到家属会见信息',
            data: {
                meetings: [],
                total: 0
            }
        };
        await db.getMeetings().findPage(ctx.request).then(async meetings => {
            console.log(meetings);
            if (meetings.length) {
                await db.getMeetings().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(500, err.message));
                meetingsList = meetings;
            } else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //查找家属信息列表
        await db.getFamilies().findByNameOrUuid(ctx.request).then(families => {
            if (families.length) familiesList = families;
            else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //查找罪犯信息列表
        await db.getPrisoners().findByPrisonerNumber(ctx.request).then(prisoners => {
            if (prisoners.length) prisonersList = prisoners;
            else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //将对应地家属信息加到家属会见信息当中
        console.log(meetingsList.length, familiesList.length, prisonersList.length);
        meetingsList.forEach((meeting, index, arr) => {
            let family, prisoner;
            ((family = familiesList.find(family => meeting.familyId === family.id)) &&
            (prisoner = prisonersList.find(prisoner => prisoner.id === family.prisonerId)) &&
            Object.assign(meeting, {
                name: family.name,
                phone: family.phone,
                uuid: family.uuid,
                prisonerNumber: prisoner.prisonerNumber,
                relationship: family.relationship
            }))
            // || (arr.splice(index, 1) && (size = arr.length));
        });
        ctx.body = {
            code: 200,
            msg: '查询家属会见信息成功',
            data: {
                meetings: meetingsList,
                total: size ? size : 0
            }
        }
    }

    //授权家属注册信息
    async authorize(ctx, next) {
        await db.getMeetings().updateMeetings(ctx.request).then(result => {
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

module.exports = new Meetings();