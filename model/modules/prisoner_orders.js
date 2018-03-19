/**
 * Created by Administrator on 2018/3/19/019.
 */
const mongoose = require('mongoose');

let prisoner_orders = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//罪犯订单id
    trade_no: {type: String, default: ''},//交易号
    jail_id: {type: Number, ref: 'jails'},//监狱id
    payment_type: {type: String, default: ''},//支付类型
    status: {type: String, default: ''},//状态
    ifreceive: {type: String, default: ''},//是否签收
    created_at: {type: String, default: Date.now},//创建时间
    updated_at: {type: String, default: Date.now},//更新时间
    amount: {type: Number, default: 0},//金额
    family_id: {type: Number, ref: 'families'},//家属id
    order_details: {type: String, default: ''},//订单描述
    total: {type: Number, default: 0},//订单总数
});

prisoner_orders.statics = {
    //添加罪犯订单信息
    createPrisonerOrders(field){
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(doc);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('prisoner_orders', prisoner_orders);