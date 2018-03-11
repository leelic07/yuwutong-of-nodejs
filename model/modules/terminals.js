/**
 * Created by Administrator on 2018/3/11 0011.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let terminals = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//终端id
    jail_id: {type: Number, ref: 'jails'},//监狱id
    terminal_number: {type: String, default: ''},//终端号
    room_number: {type: String, default: ''},//会议室号
    host_password: {type: String, default: ''},//主机密码
    metting_password: {type: String, default: ''},//会见秘密
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now}//更新时间
});

terminals.statics = {
    //分页查询设备终端信息列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        return new Promise((resolve, reject) => {
            self.find({jail_id: request.user.jail_id}, {
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
    //查询设备终端列表的记录数
    countTotal(request = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.count({jail_id: request.user.jail_id}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //新增设备终端信息
    createTerminals(...field) {
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

module.exports = mongoose.model('terminals', terminals);