/**
 * Created by Administrator on 2018/3/10 0010.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let mail_boxes = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//邮箱id
    title: {type: String, default: ''},//主题
    contents: {type: String, default: ''},//内容
    jail_id: {type: Number, ref: 'jails'},//监狱id
    status: {type: Number, default: null},//状态
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    family_id: {type: Number, ref: 'families'},//家属id
    sys_flag: {type: Number, default: 1}//是否删除(1:未删除,0:已删除)
});

mail_boxes.statics = {
    //根据id来查询监狱长邮箱信息
    findById(request = {}){
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.id ? condition.id = query.id : '';
        return new Promise((resolve, reject) => {
            self.findOne(condition, {'_id': 0, '__v': 0}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformObj(doc));
            });
        });
    },
    //分页查找监狱长邮箱列表
    findPage(request = {}){
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
    //查询监狱长邮箱列表的记录数
    findTotal(request = {}){
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
    //新增罪犯账户信息
    createMailBoxes(...field){
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //编辑监狱长邮箱信息

};

module.exports = mongoose.model('mail_boxes', mail_boxes);