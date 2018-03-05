/**
 * Created by Administrator on 2018/3/5/005.
 */
const mongoose = require('mongoose');

let prisoners = new mongoose.Schema({
    id: {type: Number, required: true},//罪犯id
    prisoner_number: String,//罪犯编号
    name: String,//罪犯名称
    gender: String,//罪犯性别
    crimes: String,//犯罪说明
    additional_punishment: String,//附加刑
    original_sentence: String,//原判
    jail_id: Number,//监狱id
    prison_term_started_at: Date,//刑期开始日期
    prisoner_term_ended_at: Date,//刑期结束日期
    created_at: {type: Date, default: Date.now},//创建日期
    updated_at: {type: Date, default: Date.now},//更新日期
    prison_area: String,//监区名称
    sys_flag: Number//是否删除（1：未删除；0：已删除）
});

class Prisoners {
    constructor(mongoose) {
        this.prisoner = mongoose.model('prisoners', prisoners);
    }

    //分页查询服刑人员信息列表
    findPage(condition = {}, field = {}, options = {}) {
        let self = this;
        let page = Number(options.page), rows = Number(options.rows);
        page = page ? page : 1;
        rows = rows ? rows : 10;
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, field, {$skip: start, $limit: rows}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        })
    }

    //查询服刑人员信息列表的记录数
    findTotal(condition = {}, field = {}, options = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.prisoner.find(condition, field, options, (e, doc) => {
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
            self.prisoner.update(condition, {updated_at: Date.now(), ...field}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        })
    }
}

module.exports = new Prisoners(mongoose);