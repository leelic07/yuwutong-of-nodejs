/**
 * Created by Administrator on 2018/3/2/002.
 */
const token = require('./modules/token');
const users = require('./modules/users');
const registrations = require('./modules/registrations');
const prisoners = require('./modules/prisoners');
const families = require('./modules/families');
const accounts = require('./modules/accounts');
const accountDetails = require('./modules/account_details');
const meetings = require('./modules/meetings');
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

    //获取服刑人员管理控制器
    getPrisonersController() {
        return this.prisoners;
    }

    //获取家属信息管理控制器
    getFamiliesController() {
        return this.families;
    }

    //获取罪犯账户列表的控制器
    getAccountsController() {
        return this.accounts;
    }

    //获取罪犯账户明细的控制器
    getAccountDetailsController() {
        return this.accountDetails;
    }

    //获取家属会见的控制器
    getMeetingsController() {
        return this.meetings;
    }
}

let controller = new Controller({
    token,
    users,
    registrations,
    prisoners,
    families,
    accounts,
    accountDetails,
    meetings
});

module.exports = controller;