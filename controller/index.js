/**
 * Created by Administrator on 2018/3/2/002.
 */
const token = require('./modules/token');
const users = require('./modules/users');
const registrations = require('./modules/registrations');

class Controller {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }

    //获取token控制器
    getTokenController() {
        return this.token;
    }

    //获取用户控制器
    getUsersController() {
        return this.users;
    }

    //获取家属注册控制器
    getRegistrationsController() {
        return this.registrations;
    }
}

let controller = new Controller({
    token,
    users,
    registrations
});

module.exports = controller;