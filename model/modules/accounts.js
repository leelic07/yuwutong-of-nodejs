/**
 * Created by Administrator on 2018/3/7/007.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let accounts = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//罪犯账户id
    prisoner_id: {type: Number, ref: 'prisoners'},//罪犯id
    balance: {type: Number, default: 0.00},//余额（默认值：0.00）
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now}//更新时间
});

accounts.statics = {
    //查询罪犯账户信息
    findAccounts(request = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.find(request, {'_id': 0, '__v': 0}, (e, doc) => {
                    if (e) {
                        console.log(e);
                        reject(e);
                    } else resolve(util.transformArr(doc));
                }
            )
        })
    },
    //分页查询罪犯账户列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.find(condition, {
                '_id': 0,
                '__v': 0
            }).skip(start).limit(rows).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //查询罪犯账户列表的记录数
    findTotal(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.count(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //新增罪犯账户信息
    createAccounts(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    }
};

module.exports = mongoose.model('accounts', accounts);