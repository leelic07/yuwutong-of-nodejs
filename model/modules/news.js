/**
 * Created by Administrator on 2018/3/16/016.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let news = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//新闻id
    title: {type: String, default: ''},//新闻标题
    contents: {type: String, default: ''},//新闻内容
    is_focus: {type: Boolean, default: false},//是否阅读（1：已阅读；0：未读）
    jail_id: {type: Number, ref: 'jails'},//监狱id
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    image_file_name: {type: String, default: ''},//文件名称
    image_content_type: {type: String, default: ''},//文件类型
    image_file_size: {type: Number, default: ''},//文件大小
    image_updated_at: {type: Date, default: ''},//文件更新时间
    image_url: {type: String, default: ''},//文件路径地址
    type_id: {type: Number, default: ''},//类型（1：狱务公开 2：工作动态 3：投诉公示）
    sys_flag: {type: Number, default: 1}//是否删除（1：未删除；0：已删除）
});

news.statics = {
    //分页查商品信息列表
    findPage(request = {}){
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {
            jail_id: request.user.jail_id,
            sys_flag: 1
        };
        query.title ? condition.title = query.title : '';
        query.type ? condition.type_id = query.type : '';
        return new Promise((resolve, reject) => {
            self.find(condition, {
                '_id': 0,
                '__v': 0
            }).skip(start).limit(rows).sort({is_focus: -1}).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            });
        });
    },
    //查询商品列表的记录数
    countTotal(request = {}){
        let self = this;
        let query = request.query;
        let condition = {
            jail_id: request.user.jail_id,
            sys_flag: 1
        };
        query.title ? condition.title = query.title : '';
        query.type ? condition.type_id = query.type : '';
        return new Promise((resolve, reject) => {
            self.count(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //添加商品信息
    addNews(field = {}){
        let self = this;
        let id = 0;
        return new Promise((resolve, reject) => {
            self.findOne().sort({id: -1}).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else {
                    if (doc) field.id = ++doc.id;
                    else field.id = ++id;
                    let item = new self(field);
                    item.save((e, doc) => {
                        if (e) reject(e);
                        else resolve(doc);
                    });
                }
            });
        });
    },
    //编辑商品信息
    updateNews(condition = {}, field = {}){
        let self = this;
        return new Promise((resolve, reject) => {
            self.update(condition, field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //删除商品信息
    deleteNews(condition = {}){
        let self = this;
        return new Promise((resolve, reject) => {
            self.update(condition, {sys_flag: 0}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('news', news);