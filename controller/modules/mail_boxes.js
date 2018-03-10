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
        await db.getMailBoxes().createComments({
            id:1,
            mail_box_id:1,

        }).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '添加监狱长邮件回复信息成功',
                data: result
            }; else ctx.body = {
                code: 500,
                msg: '添加监狱长邮件回复信息失败',
                data: ""
            }
        }).catch(err => ctx.throw(500, err.message));
        // await db.getMailBoxes().findById(ctx.request).then(mailboxDetail => {
        //     if (mailboxDetail) ctx.body = {
        //         code: 200,
        //         msg: '查询监狱长邮箱回复成功',
        //         data: {
        //             replys: mailboxDetail
        //         }
        //     }; else ctx.body = {
        //         code: 404,
        //         msg: '未找到监狱长邮箱回复',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new MailBoxes();