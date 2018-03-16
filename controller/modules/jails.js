const db = require('../../model');

class Jails {
    constructor() {
    }

    //查询监狱信息
    async index(ctx, next) {
        await db.getJails().findById(ctx.request.user.jail_id).then(jail => {
            if (jail) ctx.body = {
                code: 200,
                msg: '查询监狱信息成功',
                data: {
                    jails: jail
                }
            }; else ctx.body = {
                code: 500,
                msg: '查询监狱信息失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //修改监狱信息内容
    async update(ctx, next) {
        let body = ctx.req.body;
        let file = ctx.req.file;
        file && Object.assign(body, {
            image_file_name: file.filename,
            image_content_type: file.mimetype,
            image_file_size: file.size,
            image_updated_at: Date.now(),
            image_url: file.path,
        });
        await db.getJails().updateJails({id: body.id}, body).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '修改监狱信息成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '修改监狱信息失败',
                data: {}
            };
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new Jails();