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
    name: {type: String, default: ''},//罪犯名称
    gender: {type: String, default: ''},//罪犯性别
    crimes: {type: String, default: ''},//犯罪说明
    additional_punishment: {type: String, default: ''},//附加刑
    original_sentence: {type: String, default: ''},//原判
    jail_id: {type: Number, ref: 'jails'},//监狱id
    prison_term_started_at: {type: Date, default: ''},//刑期开始日期
    prison_term_ended_at: {type: Date, default: ''},//刑期结束日期
    created_at: {type: Date, default: new Date()},//创建日期
    updated_at: {type: Date, default: new Date()},//更新日期
    prison_area: {type: String, default: ''},//监区名称
    sys_flag: {type: Number, default: 1}//是否删除（1：未删除；0：已删除）
});

prisoners.statics = {
    //根据id查询罪犯信息
    findById(id = ''){
        let self = this;
        return new Promise((resolve, reject) => {
            self.findOne({id: id}, {'_id': 0, '__v': 0}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformObj(doc));
            });
        });
    },
    //根据罪犯编号查询罪犯信息
    findByPrisonerNumber(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.find(condition, {
                '_id': 0,
                '__v': 0
            }).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else {
                    resolve(util.transformArr(doc));
                }
            });
        });
    },
    //查询罪犯信息
    findPrisoners(request = {}) {
        let self = this;
        let condition = {jail_id: request.user.jail_id};
        return new Promise((resolve, reject) => {
            self.find(condition, {'_id': 0, '__v': 0}, (e, doc) => {
                    if (e) {
                        console.log(e);
                        reject(e);
                    } else resolve(util.transformArr(doc));
                }
            )
        })
    },
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
            self.find(condition, {
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
    },
    //查询服刑人员信息列表的记录数
    findTotal(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        return new Promise((resolve, reject) => {
            self.find(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc.length);
            })
        })
    },
    //新增服刑人员信息
    createPrisoners(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    },
    //修改服刑人员信息
    updatePrisoners(condition = {}, field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.update(condition, {updated_at: Date.now, ...field}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        })
    }
};

module.exports = mongoose.model('prisoners', prisoners);