/**
 * Created by Administrator on 2018/3/1/001.
 */
const mongoose = require('mongoose');
const config = require('../config');
const users = require('./modules/users');
const registrations = require('./modules/registrations');
const jails = require('./modules/jails');
const prisoners = require('./modules/prisoners');

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

    //获取家属注册模型
    getRegistrations() {
        return this.registrations;
    }

    //获取监狱的模型
    getJails() {
        return this.jails;
    }

    //获取服刑人员管理的模型
    getPrisoners() {
        return this.prisoners;
    }
}

let database = new DataBase({
    users,
    registrations,
    jails,
    prisoners
});

//连接数据库
database.connect(mongoose, config);

module.exports = database;

