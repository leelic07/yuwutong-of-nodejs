/**
 * Created by Administrator on 2018/3/14/014.
 */
const db = require('../../model');

class Orders {
    constructor() {
    }

    //分页查询家属订单信息
    async page(ctx, next) {
        // await db.getOrders().createOrders({
        //     id: 1,
        //     trade_no: '00001',
        //     jail_id: 1,
        //     payment_type: '手机支付',
        //     status: 'TRADE_SUCCESS',
        //     amount: 0,
        //     gmt_payment: Date.now(),
        //     datetime: Date.now(),
        //     family_id: 1,
        //     ip: '10.10.10.122'
        // }, {
        //     id: 2,
        //     trade_no: '00002',
        //     jail_id: 1,
        //     payment_type: '支付宝支付',
        //     status: 'TRADE_SUCCESS',
        //     amount: 0,
        //     gmt_payment: Date.now(),
        //     datetime: Date.now(),
        //     family_id: 2,
        //     ip: '10.10.10.122'
        // }, {
        //     id: 3,
        //     trade_no: '00004',
        //     jail_id: 1,
        //     payment_type: '微信支付',
        //     status: 'TRADE_SUCCESS',
        //     amount: 0,
        //     gmt_payment: Date.now(),
        //     datetime: Date.now(),
        //     family_id: 3,
        //     ip: '10.10.10.122'
        // }, {
        //     id: 4,
        //     trade_no: '00005',
        //     jail_id: 1,
        //     payment_type: '现金支付',
        //     status: 'TRADE_SUCCESS',
        //     amount: 0,
        //     gmt_payment: Date.now(),
        //     datetime: Date.now(),
        //     family_id: 3,
        //     ip: '10.10.10.122'
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加商品成功',
        //         data: result
        //     }; else ctx.body = {
        //         code: 500,
        //         msg: '添加商品失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        await db.getOrders().findPage(ctx.request).then(async orders => {
            if (orders.length) {
                await db.getOrders().countTotal(ctx.request).then(total => {
                    if (total) ctx.body = {
                        code: 200,
                        msg: '分页查询商品列表成功',
                        data: {
                            orders: orders,
                            orderSize: total
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

    //查看家属订单详情
    async description(ctx, next) {
        // await db.getLineItems().createLineItems({
        //     id:1,
        //     item_id:1,
        //     order_id:1,
        //     quantity:2,
        // },{
        //     id:2,
        //     item_id:2,
        //     order_id:2,
        //     quantity:5,
        // },{
        //     id:3,
        //     item_id:3,
        //     order_id:3,
        //     quantity:7,
        // },{
        //     id:4,
        //     item_id:4,
        //     order_id:1,
        //     quantity:3
        // }).then(result=>{
        //     if(result) ctx.body = {
        //         code:200,
        //         msg:'添加商品订单成功',
        //         data:result
        //     };else ctx.body = {
        //         code:500,
        //         msg:'添加商品订单失败',
        //         data:{}
        //     }
        // }).catch(err=>ctx.throw(500,err.message));

        await db.getOrders().findById(ctx.request.query.id).then(async order => {
            if (order) {
                await db.getFamilies().findById(order.familyId).then(async family => {
                    if (family) {
                        await db.getPrisoners().findById(family.prisonerId).then(async prisoner => {
                            if (prisoner) {
                                await db.getJails().findById(prisoner.jailId).then(async jail => {
                                    if (jail) {
                                        await db.getLineItems().findByOrderId(order.id).then(async lineItems => {
                                            if (lineItems.length) {
                                                await db.getItems().findItems(ctx.request).then(async items => {
                                                    if (items.length) {
                                                        lineItems.forEach(line => {
                                                            let item = items.find(item => line.orderId === item.id);
                                                            if (item) {
                                                                line.title = item.title;
                                                                line.price = item.price;
                                                                order.amount += item.price * line.quantity;
                                                            }
                                                        });
                                                        await db.getOrders().updateOrders({id: order.id}, {amount: order.amount}).then(result => {
                                                            if (result) ctx.body = {
                                                                code: 200,
                                                                msg: '查询商品订单详情成功',
                                                                data: {
                                                                    order: order,
                                                                    jail: jail,
                                                                    prisoner: prisoner,
                                                                    result: lineItems
                                                                }
                                                            }; else ctx.body = {
                                                                code: 500,
                                                                msg: '家属订单成功失败',
                                                                data: {}
                                                            };
                                                        }).catch(err => ctx.throw(500, err.message));
                                                    }
                                                }).catch(err => ctx.throw(500, err.message));
                                            }
                                        }).catch(err => ctx.throw(500, err.message));
                                    }
                                }).catch(err => ctx.throw(500, err.message));
                            }
                        }).catch(err => ctx.throw(500, err.message));
                    }
                }).catch(err => ctx.throw(500, err.message));
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //修改家属订单信息
    async update(ctx, next) {
        let id = ctx.request.body.id;
        let status = ctx.request.body.status;
        await db.getOrders().updateOrders({id: id}, {status: status}).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '修改配送状态成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '修改配送状态失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new Orders();