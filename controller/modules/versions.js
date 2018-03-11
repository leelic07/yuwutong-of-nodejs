/**
 * Created by Administrator on 2018/3/11 0011.
 */
const db = require('../../model');

class Versions {
    constructor() {
    }

    //查询app版本信息列表
    async versions(ctx, next) {
        // await db.getVersions().createVersions({
        //     id: 1,
        //     version_code: '001',
        //     version_number: 1.0,
        //     type_id: 1,
        //     description: '狱务通家属版',
        //     download: 'https://www.yuwugongkai.com/',
        //     is_force: 1
        // }, {
        //     id: 2,
        //     version_code: '002',
        //     version_number: 2.0,
        //     type_id: 2,
        //     description: '狱务通监狱版',
        //     download: 'https://www.yuwugongkai.com/',
        //     is_force: 0
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加app版本信息成功',
        //         data: result
        //     }; else ctx.body = {
        //         code: 500,
        //         msg: '添加app版本信息失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let size;//app版本信息列表的记录数
        await db.getVersions().findPage(ctx.request).then(async versions => {
            if (versions.length) {
                await db.getVersions().countTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(500, err.message));
                ctx.body = {
                    code: 200,
                    msg: '查询app版本信息成功',
                    data: {
                        versions: versions,
                        versionsSize: size ? size : 0
                    }
                }
            } else ctx.body = {
                code: 404,
                msg: '未找到app版本信息',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //更新app版本
    async update(ctx, next) {
        await db.getVersions().updateVersions(ctx.request).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '修改app版本信息成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '修改app版本信息失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new Versions();