/**
 * Created by Administrator on 2018/3/5/005.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('../../util');

let prisoners = new Schema({
    id: {type: Number, required: true, unique: true},//罪犯id
    prisoner_number: String,//罪犯编号
    // families: [{type: Number, ref: 'families'}],//罪犯对应的家属信息
    name: String,//罪犯名称
    gender: String,//罪犯性别
    crimes: String,//犯罪说明
    additional_punishment: String,//附加刑
    original_sentence: String,//原判
    jail_id: {type: Number, ref: 'jails'},//监狱id
    prison_term_started_at: Date,//刑期开始日期
    prison_term_ended_at: Date,//刑期结束日期
    created_at: {type: Date, default: new Date()},//创建日期
    updated_at: {type: Date, default: new Date()},//更新日期
    prison_area: String,//监区名称
    sys_flag: {type: Number, default: 1}//是否删除（1：未删除；0：已删除）
});

class Prisoners {
    constructor(mongoose) {
        this.prisoner = mongoose.model('prisoners', prisoners);
    }

    //查询罪犯信息
    find(request = {}) {
        let self = this;
        let condition = {jail_id: request.user.jail_id};
        // request.query ? Object.assign(condition, request.query) : '';
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, {'_id': 0, '__v': 0}, (e, doc) => {
                    if (e) {
                        console.log(e);
                        reject(e);
                    } else resolve(util.transformArr(doc));
                }
            )
        })
    }

    //查询罪犯信息
    findOrigin(request = {}) {
        let self = this;
        let condition = {jail_id: request.user.jail_id};
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, {'_id': 0, '__v': 0}, (e, doc) => {
                    if (e) {
                        console.log(e);
                        reject(e);
                    } else resolve(doc);
                }
            )
        })
    }

    //分页查询服刑人员信息列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, {
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

    //分页查询服刑人员信息列表
    findPageOrigin(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, {
                '_id': 0,
                '__v': 0
            }).skip(start).limit(rows).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    //查询服刑人员信息列表的记录数
    findTotal(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc.length);
            })
        })
    }

    //新增服刑人员信息
    create(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.prisoner.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    }

    //修改服刑人员信息
    update(condition = {}, field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.prisoner.update(condition, {updated_at: Date.now, ...field}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        })
    }
}

module.exports = new Prisoners(mongoose);