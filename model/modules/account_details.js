/**
 * Created by Administrator on 2018/3/8/008.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let account_details = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},//账户明细id
    account_id: {type: Number, ref: 'accounts'},//罪犯账户id
    amount: {type: Number, default: 0.00},//账户金额
    reason: {type: String, default: ''},//原因
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now}//更新时间
});

class AccountDetails {
    constructor(mongoose) {
        this.accountDetails = mongoose.model('account_details', account_details);
    }

    //根据id查询罪犯账户明细
    findByAccountId(id) {
        let self = this;
        let account_id = id;
        return new Promise((resolve, reject) => {
            self.accountDetails.find({account_id: account_id}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            });
        })
    }

    //新增罪犯账户明细
    create(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.accountDetails.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    }
}

module.exports = new AccountDetails(mongoose);