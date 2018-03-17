/**
 * Created by Administrator on 2018/3/13/013.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let items = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//商品ic
    title: {type: String, default: ''},//标题
    description: {type: String, default: ''},//描述
    price: {type: Number, default: ''},//价格
    jail_id: {type: Number, ref: 'jails'},//监狱id
    category_id: {type: Number, default: ''},//商品类别id
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    barcode: {type: String, default: ''},//条码
    unit: {type: String, default: ''},//单位
    factory: {type: String, default: ''},//厂商
    ranking: {type: Number, default: ''},//排名
    avatar_file_name: {type: String, default: ''},//背景名称
    avatar_file_type: {type: String, default: ''},//背景图片类型
    avatar_file_size: {type: Number, default: ''},//背景图片大小
    avatar_updated_at: {type: Date, default: Date.now},//背景图片更新
    avatar_url: {type: String, default: ''},//背景图片路径地址
    sys_flag: {type: Number, default: 1},//是否删除（1：未删除,0:已删除）
});

items.statics = {
    //根据id查询商品信息
    findById(request = {}){
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.id ? condition.id = query.id : '';
        return new Promise((resolve, reject) => {
            self.findOne(condition, {'_id': 0, '__v': 0}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformObj(doc));
            });
        });
    },
    //分页查商品信息列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {jail_id: request.user.jail_id};
        query.title ? condition.title = query.title : '';
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
    //查询商品列表的记录数
    countTotal(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.title ? condition.title = query.title : '';
        return new Promise((resolve, reject) => {
            self.count(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //新增商品信息
    createItems(...field){
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('items', items);