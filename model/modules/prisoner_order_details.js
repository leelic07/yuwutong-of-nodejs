/**
 * Created by Administrator on 2018/3/19/019.
 */
const mongoose = require('mongoose');

let prisoner_order_details = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//犯人订单明细id
    prisoner_orders_id: {type: Number, ref: 'prisoner_orders'},//犯人订单id
    prisoner_id: {type: Number, ref: 'prisoners'},//犯人id
    goods_name: {type: String, default: ''},//商品名称
    goods_price: {type: Number, default: 0},//商品价格
    goods_details: {type: String, default: ''},//商品描述
    goods_num: {type: Number, default: 0}//商品数量
});

prisoner_order_details.statics = {};

module.exports = mongoose.model('prisoner_order_details', prisoner_order_details);