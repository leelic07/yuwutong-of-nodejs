/**
 * Created by Administrator on 2018/3/14/014.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let orders = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//订单id
    trade_no: {type: String, default: ''},//交易号
    jail_id: {type: Number, ref: 'jails'},//监狱id
    payment_type: {type: String, default: ''},//支付类型
    status: {type: String, default: ''},//状态
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    amount: {type: Number, default: 0},//金额
    gmt_payment: {type: Date, default: ''},//支付时间
    datetime: {type: Date, default: ''},//日期
    family_id: {type: Number, default: ''},//家属id
    ip: {type: String, default: ''}//ip
});

orders.statics = {
    //根据家属订单id查询家属订单信息
    findById(id = ''){
        let self = this;
        return new Promise((resolve, reject) => {
            self.findOne({id: id}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformObj(doc));
            });
        })
    },
    //分页查家属订单信息列表
    findPage(request = {}){
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {
            jail_id: request.user.jail_id,
            status: 'TRADE_SUCCESS'
        };
        return new Promise((resolve, reject) => {
            self.find(condition, {
                '_id': 0,
                '__v': 0
            }).skip(start).limit(rows).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            });
        });
    },
    //查询家属订单列表的记录数
    countTotal(request = {}){
        let self = this;
        let condition = {
            jail_id: request.user.jail_id,
            status: 'TRADE_SUCCESS'
        };
        return new Promise((resolve, reject) => {
            self.count(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //新增家属订单信息
    createOrders(...field){
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //编辑家属订单信息
    updateOrders(condition = {}, field = {}){
        let self = this;
        return new Promise((resolve, reject) => {
            self.update(condition, {...field, updated_at: Date.now()}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('orders', orders);