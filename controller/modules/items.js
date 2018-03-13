/**
 * Created by Administrator on 2018/3/14/014.
 */
const db = require('../../model');

class Items {
    constructor() {
    }

    //获取商品信息列表
    async page(ctx, next) {
        // await db.getItems().createItems({
        //     id: 1,
        //     title: '洗发水',
        //     description: '日常用品 洗发水',
        //     price: 11.0,
        //     jail_id: 1,
        //     category_id: 1,
        //     barcode: '123456',
        //     unit: '瓶',
        //     factory: '国科云通',
        //     ranking: 1,
        // }, {
        //     id: 2,
        //     title: '牛奶',
        //     description: '食品饮料',
        //     price: 3.0,
        //     jail_id: 1,
        //     category_id: 2,
        //     barcode: '654321',
        //     unit: '瓶',
        //     factory: '国科云通',
        //     ranking: 2,
        // }, {
        //     id: 3,
        //     title: '亲情电话卡',
        //     description: '电话卡',
        //     price: 20.0,
        //     jail_id: 1,
        //     category_id: 5,
        //     barcode: '789065',
        //     unit: '张',
        //     factory: '国科云通',
        //     ranking: 3,
        // }, {
        //     id: 4,
        //     title: '感康',
        //     description: '感冒药品',
        //     price: 12.0,
        //     jail_id: 1,
        //     category_id: 4,
        //     barcode: '456789',
        //     unit: '盒',
        //     factory: '国科云通',
        //     ranking: 4,
        // }).then(items => {
        //     if (items.length) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '添加商品信息成功',
        //             data: items
        //         }
        //     } else {
        //         ctx.body = {
        //             code: 200,
        //             msg: '添加商品信息失败',
        //             data: {}
        //         }
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        await db.getItems().findPage(ctx.request).then(async items => {
            if (items.length) {
                await db.getItems().countTotal(ctx.request).then(total => {
                    if (total) {
                        ctx.body = {
                            code: 200,
                            msg: '分页查询商品列表成功',
                            data: {
                                items: items,
                                itemSize: total
                            }
                        }
                    }
                }).catch(err => ctx.throw(500, err.message));
            } else ctx.body = {
                code: 500,
                msg: '分页查询商品列表失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //查询商品详情信息
    async description(ctx, next) {
        await db.getItems().findById(ctx.request).then(item => {
            if (item) ctx.body = {
                code: 200,
                msg: '查询商品详情成功',
                data: item
            }; else ctx.body = {
                code: 500,
                msg: '查询商品详情失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //编辑或者添加
    async add(ctx, next) {
        console.log(ctx.req.body);
        if (ctx.req.file) {
            ctx.body = {
                code: 200,
                msg: '上传文件成功',
                path: ctx.req.file.path
            };
        } else ctx.body = {
            code: 500,
            msg: '上传文件失败',
            data: {
                filepath: ''
            }
        }
    }
}

module.exports = new Items();