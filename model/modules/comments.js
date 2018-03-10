/**
 * Created by Administrator on 2018/3/10 0010.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let comments = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//邮件回复表id
    mail_box_id: {type: Number, ref: 'mail_boxes'},//监狱长邮箱id
    contents: {type: String, default: ''},//内容
    family_id: {type: String, ref: 'families'},//家属id
    user_id: {type: Number, ref: 'users'},//用户id
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now}//更新时间
});

comments.statics = {
    //根据id查询监狱长邮件回复
    findByMailboxId(request = {}){
        let self = this;
        let query = request.query;
        let condition = {};
        query.id ? condition.id = query.id : '';
        return new Promise((resolve, reject) => {
            self.findOne(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformObj(doc));
            });
        });
    },
    //新增监狱长邮箱回复信息
    createComments(...field){
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};