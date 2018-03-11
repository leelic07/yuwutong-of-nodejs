/**
 * Created by Administrator on 2018/3/10 0010.
 */
const db = require('../../model');

class MailBoxes {
    constructor() {
    }

    //查询监狱长邮箱列表
    async mailboxes(ctx, next) {
        // await db.getMailBoxes().createMailBoxes({
        //     id: 1,
        //     title: '给监狱长的一封信',
        //     contents: '监狱长您好',
        //     jail_id: 1,
        //     family_id: 1
        // }, {
        //     id: 2,
        //     title: '给副监狱长的一封信',
        //     contents: '副监狱长您好',
        //     jail_id: 1,
        //     family_id: 2
        // }, {
        //     id: 3,
        //     title: '给刑法执行科的一封信',
        //     contents: '刑法科科长您好',
        //     jail_id: 1,
        //     family_id: 3
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加监狱长邮箱信息成功',
        //         data: result
        //     }; else ctx.body = {
        //         code: 500,
        //         msg: '添加监狱长邮箱信息失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let size;//监狱长邮箱列表的总记录数
        let mailBoxesList = [];
        let familiesList = [];//监狱长邮箱的记录列表
        let ids = [];//监狱长邮箱的发件人id数组
        let failure = {//查询监狱长邮箱失败的提示信息
            code: 404,
            msg: '未找到监狱长邮箱信息',
            data: {}
        };
        //分页查找监狱长邮箱列表
        await db.getMailBoxes().findPage(ctx.request).then(async mailBoxes => {
            if (mailBoxes.length) {
                await db.getMailBoxes().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(500, err.message));
                mailBoxesList = mailBoxes;
                mailBoxes.forEach(mail => ids.push(mail.familyId));
            } else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //根据家属id查找家属信息列表
        ids.length && await db.getFamilies().findByIds(ids).then(families => {
            if (families.length) familiesList = families;
            else ctx.body = failure;
        }).catch(err => ctx.throw(500, err.message));
        //把对应家属id的家属姓名加入到监狱长邮箱列表的信息中
        let family;//对应监狱长邮箱的家属
        mailBoxesList.forEach(mailboxes => {
            family = familiesList.find(family => family.id === mailboxes.familyId);
            family && Object.assign(mailboxes, {name: family.name});
        });
        family && (ctx.body = {
            code: 200,
            msg: '查询监狱长邮箱信息成功',
            data: {
                mailBoxes: mailBoxesList,
                total: size ? size : 0
            }
        }) || (ctx.body = failure);
    }

    //查看监狱长邮箱详情信息
    async jailReply(ctx, next) {
        // await db.getComments().createComments({
        //     id: 1,
        //     mail_box_id: 1,
        //     contents: '你好啊',
        //     family_id: 1,
        //     user_id: 1,
        // }, {
        //     id: 2,
        //     mail_box_id: 1,
        //     contents: '有什么事情吗？',
        //     family_id: 1,
        //     user_id: 1,
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加监狱长邮件回复信息成功',
        //         data: result
        //     }; else ctx.body = {
        //         code: 500,
        //         msg: '添加监狱长邮件回复信息失败',
        //         data: ""
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let mailboxDetailTemp;
        let familyTemp;
        let prisonerTemp;
        let commentsTemp;
        //根据id查询监狱长邮箱信息
        await db.getMailBoxes().findById(ctx.request).then(async mailboxDetail => {
            //根据家属id查询家属信息
            (mailboxDetailTemp = mailboxDetail) && await db.getFamilies().findById(mailboxDetail.familyId).then(async family => {
                //根据罪犯id查询罪犯信息
                (familyTemp = family) && await db.getPrisoners().findById(family.prisonerId).then(async prisoner => {
                    //根据监狱长邮箱id查询监狱长回复信息
                    (prisonerTemp = prisoner) && await db.getComments().findByMailboxId(mailboxDetail.id).then(comments => {
                        // console.log(mailboxDetail, family, prisoner, comments);
                        commentsTemp = comments
                    }).catch(err => ctx.throw(500, err.message));
                }).catch(err => ctx.throw(500, err.message));
            }).catch(err => ctx.throw(500, err.message));
            //将监狱长邮箱，家属信息，罪犯信息，和监狱长邮箱回复信息合并
            if (mailboxDetailTemp && familyTemp && prisonerTemp && commentsTemp) (ctx.body = {
                code: 200,
                msg: '查询监狱长邮箱回复成功',
                data: {
                    replys: Object.assign(mailboxDetail, {
                        name: familyTemp.name,
                        prisonerName: prisonerTemp.name,
                        relationship: familyTemp.relationship,
                        comments: commentsTemp
                    })
                }
            }); else ctx.body = {
                code: 404,
                msg: '未找到监狱长邮箱回复内容',
                data: {}
            };
        }).catch(err => ctx.throw(500, err.message));
    }

    //监狱长回复家属邮件
    async reply(ctx, next) {
        await db.getComments().addComments(ctx.request).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '回复邮件成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '回复邮件成功',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new MailBoxes();