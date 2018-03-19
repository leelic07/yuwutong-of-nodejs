/**
 * Created by Administrator on 2018/3/13/013.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let prison_terms = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//刑期变动id
    term_start: {type: Date, default: ''},//刑期开始日期
    term_finish: {type: Date, default: ''},//刑期结束日期
    prisoner_id: {type: Number, ref: 'prisoners'},//罪犯id
    changetype: {type: String, default: ''},//刑期变动类型
    sentence: {type: Number, default: ''},//原判总刑期
    courtchange: {type: Number, default: ''},//减刑总幅度
    changeyear: {type: Number, default: ''},//减刑（年）
    changemonth: {type: Number, default: ''},//减刑（月）
    changeday: {type: Number, default: ''},//减刑（日）
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now}//更新时间
});

prison_terms.statics = {
    //解析刑期变动excel信息
    parsePrisonTerms(field = []) {
        let self = this;
        let id = 0;
        return new Promise((resolve, reject) => {
            self.findOne().sort({id: -1}).exec((e, doc) => {
                if (e) reject(e);
                else {
                    if (doc) field.forEach(f => f.id = ++doc.id);
                    else field.forEach(f => f.id = ++id);
                    self.insertMany(field, (e, doc) => {
                        if (e) {
                            console.log(e);
                            reject(e);
                        } else resolve(doc);
                    });
                }
            });
        });
    },
    //查询刑期变动表
    findTerms(condition = {}, field = {}, options = {}){
        let self = this;
        return new Promise((resolve, reject) => {
            self.find(condition, field, options, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            })
        });
    },
    // //增加刑期变动
    // create(...field){
    //     let self = this;
    //     return new Promise((resolve, reject) => {
    //         self.create(...field, (e, doc) => {
    //             if (e) {
    //                 console.log(e);
    //                 reject(e);
    //             } else resolve(doc);
    //         });
    //     });
    // },
    //修改刑期变动
    updateTerms(condition = {}, field = {}, options = {}){
        let self = this;
        return new Promise((resolve, reject) => {
            self.update(condition, field, options, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    }
};

module.exports = mongoose.model('prison_terms', prison_terms);