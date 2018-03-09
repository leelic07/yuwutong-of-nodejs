/**
 * Created by Administrator on 2018/3/1/001.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let users = new Schema({
    id: {type: Number, required: true},//用户id
    username: {type: String, default: ''},//真实姓名
    salt: {type: String, default: ''},//登录名
    hashed_password: {type: String, default: ''},//登录密码
    role: {type: Number, default: ''},//角色id
    jail_id: {type: Number, ref: 'jails'},//监狱id
    created_at: {type: Date, default: Date.now()},//创建时间
    updated_at: {type: Date, default: Date.now()},//更新时间
});

//用户类型
users.statics = {
    //查询用户
    findUsers(condition = {}, field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.findOne(condition, field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //新增用户
    createUsers(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        });
    },
    //修改用户
    updateUsers(condition = {}, field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.update(condition, {updated_at: Date.now(), ...field}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //删除用户
    removeUsers(condition = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.remove(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('users', users);