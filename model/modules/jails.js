/**
 * Created by Administrator on 2018/3/5/005.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jails = new Schema({
    id: {type: Number, required: true},//监狱id
    prison: {type: String, default: ''},//监狱代码
    title: {type: String, default: ''},//监狱名称
    description: {type: String, default: ''},//监狱描述
    street: {type: String, default: ''},//街道门号
    district: {type: String, default: ''},//街区
    city: {type: String, default: ''},//城市
    state: {type: String, default: ''},//省分
    zipcode: {type: String, default: ''},//邮政编号
    accid: {type: String, default: ''},
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    image_file_name: {type: String, default: ''},//文件名称
    image_content_type: {type: String, default: ''},//文件类型
    image_file_size: {type: Number, default: 0},//文件大小
    image_updated_at: {type: Date, default: Date.now},//文件更新时间
    image_url: {type: String, default: '/upload/images/default.png'}//文件路径地址
});

class Jails {
    constructor(mongoose) {
        this.jail = mongoose.model('jails', jails);
    }

    //查询监狱信息
    find(condition = {}, field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.jail.findOne(condition, field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }

    //添加监狱信息
    create(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.jail.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc)
            });
        })
    }

    //修改监狱信息
    update(condition = {}, field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.jail.update(condition, field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        })
    }
}

module.exports = new Jails(mongoose);