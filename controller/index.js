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
const mail_boxes = require('./modules/mail_boxes');
const terminals = require('./modules/terminals');
const versions = require('./modules/versions');
const upload = require('./modules/upload');

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

    //获取监狱长邮箱的控制器
    getMailBoxesController() {
        return this.mail_boxes;
    }

    //获取设备终端的控制器
    getTerminalsController() {
        return this.terminals;
    }

    //获取app终端信息的控制器
    getVersionsController() {
        return this.versions;
    }

    //获取上传文件的控制器
    getUploadController() {
        return this.upload;
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
    meetings,
    mail_boxes,
    terminals,
    versions,
    upload
});

module.exports = controller;