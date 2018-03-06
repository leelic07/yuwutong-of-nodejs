/**
 * Created by Administrator on 2018/3/6/006.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let families = new mongoose.Schema({
    id: {type: Number, required: true},//罪犯家属id
    prisoner_id: {type: Number, ref: 'prisoners'},//犯人id
    name: String,//家属名称
    uuid: String,//身份证号码
    phone: String,//联系电话
    relationship: String,//关系
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    image_url: String,//家属头像路径
    balance: {type: Number, default: 0.00},//余额（默认值：0.00）
    last_trade_no: String//截止交易号
});

class Families {
    constructor(mongoose) {
        this.families = mongoose.model('families', families);
    }

    //分页查询家属信息列表
    findPage(query = {}) {
        let self = this;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {};
        query.name ? condition.name = query.name : '';
        query.uuid ? condition.uuid = query.uuid : '';
        return new Promise((resolve, reject) => {
            self.families.find(condition, {
                '_id': 0,
                '__v': 0
            }).skip(start).limit(rows).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else {
                    resolve(util.transformArr(doc));
                }
            });
        });
    }

    //查询服刑人员信息列表的记录数
    findTotal(query = {}) {
        let self = this;
        let condition = {};
        query.name ? condition.name = query.name : '';
        query.uuid ? condition.uuid = query.uuid : '';
        return new Promise((resolve, reject) => {
            self.families.find(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        })
    }

    //通过罪犯id查询家属信息
    findByPrisonerId(query = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.families.find(query, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            });
        })
    }

    //新增家属信息
    create(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.families.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    }
}

module.exports = new Families(mongoose);