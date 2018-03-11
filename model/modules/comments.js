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
    //根据监狱长邮箱id查询监狱长邮件回复信息
    findByMailboxId(id = ''){
        let self = this;
        return new Promise((resolve, reject) => {
            self.find({mail_box_id: id}, {'_id': 0, '__v': 0}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
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
    },
    //添加一条监狱长邮箱的回复信息
    addComments(request = {}){
        let self = this;
        let body = request.body;
        let condition = {user_id: request.user.user_id};
        body.id ? condition.mail_box_id = body.id : '';
        body.familyId ? condition.family_id = body.familyId : '';
        body.contents ? condition.contents = body.contents : '';
        return new Promise((resolve, reject) => {
            self.findOne().sort({id: -1}).exec((e, doc) => {
                if (e) reject(e);
                else {
                    condition.id = doc.id + 1;
                    self.create(condition, (e, doc) => {
                            if (e) {
                                console.log(e);
                                reject(e);
                            } else resolve(doc);
                        }
                    );
                }
            });
        });
    }
};

module.exports = mongoose.model('comments', comments);