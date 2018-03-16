/**
 * Created by Administrator on 2018/3/16/016.
 */
const db = require('../../model');

class News {
    constructor() {
    }

    //新增新闻信息
    async add(ctx, next) {
        let body = ctx.req.body;
        let file = ctx.req.file;
        body.is_focus = body.isFocus ? body.isFocus : false;
        body.type_id = body.typeId ? body.typeId : '';
        body.jail_id = ctx.request.user.jail_id;
        file && Object.assign(body, {
            image_file_name: file.filename,
            image_content_type: file.mimetype,
            image_file_size: file.size,
            image_updated_at: Date.now(),
            image_url: file.path,
        });
        if (body.id) {
            await db.getNews().updateNews({id: body.id}, body).then(result => {
                if (result) ctx.body = {
                    code: 200,
                    msg: '编辑新闻信息成功',
                    data: {}
                }; else ctx.body = {
                    code: 500,
                    msg: '编辑新闻信息失败',
                    data: {}
                }
            }).catch(err => ctx.throw(500, err.message));
        } else {
            await db.getNews().addNews(body).then(news => {
                if (news) ctx.body = {
                    code: 200,
                    msg: '添加新闻信息成功',
                    data: {}
                }; else ctx.body = {
                    code: 500,
                    msg: '添加新闻信息失败',
                    data: {}
                }
            }).catch(err => ctx.throw(500, err.message));
        }
    }

    //分页查询新闻信息
    async page(ctx, next) {
        await db.getNews().findPage(ctx.request).then(async news => {
            if (news.length) {
                await db.getNews().countTotal(ctx.request).then(total => {
                    if (total) ctx.body = {
                        code: 200,
                        msg: '分页查询新闻信息成功',
                        data: {
                            news: news,
                            newsSize: total
                        }
                    };
                }).catch(err => ctx.throw(500, err.message));
            } else ctx.body = {
                code: 404,
                msg: '未找到新闻信息',
                data: {
                    news: [],
                    newsSize: 0
                }
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //删除新闻信息
    async delete(ctx, next) {
        await db.getNews().deleteNews({id: ctx.request.body.id}).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '删除新闻信息成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '删除新闻信息失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new News();