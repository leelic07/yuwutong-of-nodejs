/**
 * Created by Administrator on 2018/3/11 0011.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let versions = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//app版本id
    version_code: {type: String, default: ''},//版本代码
    version_number: {type: Number, default: ''},//版本号
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    type_id: {type: Number, default: ''},//1:表示家属版本，2:表示监狱版本
    description: {type: String, default: ''},//描述
    download: {type: String, default: ''},//下载地址
    is_force: {type: Number, default: ''}//1:是强制,0:不是强制
});

versions.statics = {
    //分页查询app版本信息列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {};
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        query.versionNumber ? condition.version_number = query.versionNumber : '';
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
    //查询app版本信息列表的记录数
    countTotal(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {};
        query.versionNumber ? condition.version_number = query.versionNumber : '';
        return new Promise((resolve, reject) => {
            self.count(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //新增app版本信息
    createVersions(...field) {
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
    //更新app版本信息
    updateVersions(request = {}){
        let self = this;
        let body = request.body;
        let condition = {};
        let field = {};
        body.id ? condition.id = body.id : '';
        body.versionCode ? field.version_code = body.versionCode : '';
        body.versionNumber ? field.version_number = body.versionNumber : '';
        body.isForce ? field.is_force = body.isForce : '';
        return new Promise((resolve, reject) => {
            self.update(condition, field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('versions', versions);