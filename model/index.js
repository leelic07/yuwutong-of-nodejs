/**
 * Created by Administrator on 2018/3/1/001.
 */
const mongoose = require('mongoose');
const config = require('../config');
const users = require('./modules/users');

//数据库对象
class DataBase {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }

    //连接数据库
    connect(mongoose, config) {
        //连接MongoDB数据库
        mongoose.connect(config.database);
        //数据库连接成功事件
        mongoose.connection.on('connected', () => console.log('mongodb has been connected'));
        //数据库连接出错事件
        mongoose.connection.on('error', () => console.log('mongodb connect error'));
        //数据库断开连接事件
        mongoose.connection.on('disconnected', () => console.log('mongodb has been disconnected'));
    }

    //获取用户模型
    getUsers() {
        return this.users;
    }
}

let database = new DataBase({
    users
});
//连接数据库
database.connect(mongoose, config);
//将数据库对象放到上下文当中
// app.context.db = database;

module.exports = database;

