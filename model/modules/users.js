/**
 * Created by Administrator on 2018/3/1/001.
 */
let mongoose = require('mongoose');

let users = new mongoose.Schema({
    username: String,//真实姓名
    salt: String,//登录名
    hashed_password: String,//登录密码
    role: Number,//角色id
    jail_id: Number,//监狱id
    created_at: {type: Date, default: Date.now()},//创建时间
    update_at: {type: Date, default: Date.now()},//更新时间
    token: String
});

//用户类型
class User {
    constructor() {
        this.user = mongoose.model('users', users);
    }

    //查询用户
    find(condition = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.user.find(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }

    //新增用户
    create(data = {}) {
        let self = this;
        typeof data === 'object' && (data = [].push(data));
        return new Promise((resolve, reject) => {
            self.insertMany(data, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        });
    }

    //修改用户
    update(condition = {}, data = {}) {
        let self = this;
        !data.update_at && (data.update_at = Date.now());
        return new Promise((resolve, reject) => {
            self.user.update(condition, data, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }

    //删除用户
    remove(condition = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.user.remove(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
}

module.exports = new User();