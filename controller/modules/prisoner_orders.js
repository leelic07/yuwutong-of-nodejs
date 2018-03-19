/**
 * Created by Administrator on 2018/3/19/019.
 */
const db = require('../../model');
const util = require('../../util');

class PrisonerOrders {
    constructor() {
    }

    //解析罪犯订单的excel文件
    async processing(ctx, next) {
        let data = util.excelparser(ctx.request.query.filepath);
        let prisonerNumbers = [];//所有罪犯订单的罪犯编号数组
        let prisoner_order_details = [];//罪犯订单明细列表
        let prisoner_orders = [];//罪犯订单列表
        for (let i = 1; i < data.length; i++) {
            let param = data[i];
            prisonerNumbers.push(param[5]);
            prisoner_orders.push({
                status: param[0],
                ifreceive: param[1],
                created_at: param[2],
                trade_no: param[3],
                order_details: param[8],
                family_id: param[9],
                updated_at: param[10],
                payment_type: param[11],
                amount: param[12],
            });

            prisoner_order_details.push({
                goods_price: param[13],
                goods_details: param[4],
                prisoner_number: param[5],
                goods_num: param[6],
                goods_name: param[7]
            });
        }

        await db.getPrisonerOrders().findOne().sort({id: -1}).exec(async (err, doc) => {
            if (err) ctx.throw(500, err.message);
            else {
                let id = 0;
                if (doc) prisoner_orders.forEach((order, index) => {
                    order.id = ++doc.id;
                    prisoner_order_details[index].prisoner_orders_id = order.id;
                });
                else prisoner_orders.forEach((order, index) => {
                    order.id = ++id;
                    prisoner_orders_details[index].pirosner_orders_id = order.id;
                });
                await db.getPrisonerOrders().createPrisonerOrders(prisoner_orders).then(async prisonerOrders => {
                    if (prisonerOrders.length) {
                        await db.getPrisonerOrderDetails().findOne().sort({id: -1}).exec(async (err, doc) => {
                            if (err) ctx.throw(500, err.message);
                            else {
                                let id = 0;
                                if (doc) prisoner_order_details.forEach(order => order.id = ++doc.id);
                                else prisoner_order_details.forEach(order => order.id = ++id);
                                await db.getPrisoners().findByPrisonerNumbers(prisonerNumbers).then(async prisoners => {
                                    if (prisoners.length) {
                                        let prisonerOrderDetails = [];
                                        prisoner_order_details.forEach(order => {
                                            let prisoner = prisoners.find(prisoner => prisoner.prisoner_number === order.prisoner_number);
                                            if (prisoner) {
                                                order.prisoner_id = prisoner.id;
                                                prisonerOrderDetails.push(order);
                                            }
                                        });
                                        await db.getPrisonerOrderDetails().createPrisonerOrderDetails(prisonerOrderDetails).then(async prisonerDetails => {
                                            if (prisonerDetails.length) ctx.body = {
                                                code: 200,
                                                msg: '解析文件成功',
                                                data: {
                                                    add_total: prisonerDetails.length,
                                                    success_total: prisonerDetails.length,
                                                    update_total: 0
                                                }
                                            }; else ctx.body = {
                                                code: 500,
                                                msg: '解析文件失败',
                                                data: {}
                                            }
                                        }).catch(err => ctx.throw(500, err.message));
                                    } else ctx.body = {
                                        code: 200,
                                        msg: '未找到对应罪犯',
                                        data: {}
                                    }
                                }).catch(err => ctx.throw(500, err.message));
                            }
                        });
                    } else ctx.body = {
                        code: 500,
                        msg: '解析文件失败',
                        data: {}
                    }
                }).catch(err => ctx.throw(500, err.message));
            }
        });

        // if (prisonerOrderDetailsList.length && prisonerOrdersList.length) ctx.body = {
        //     code: 200,
        //     msg: '解析文件成功',
        //     data: {
        //         add_total: prisonerOrdersList.length,
        //         success_total: prisonerOrdersList.length,
        //         update_total: 0
        //     }
        // }; else ctx.body = {
        //     code: 500,
        //     msg: '解析文件失败',
        //     data: {}
        // }
    }
}

module.exports = new PrisonerOrders();