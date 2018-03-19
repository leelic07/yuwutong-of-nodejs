/**
 * Created by Administrator on 2018/3/1/001.
 */
const mongoose = require('mongoose');
const config = require('../config');
const users = require('./modules/users');
const registrations = require('./modules/registrations');
const jails = require('./modules/jails');
const prisoners = require('./modules/prisoners');
const families = require('./modules/families');
const accounts = require('./modules/accounts');
const account_details = require('./modules/account_details');
const meetings = require('./modules/meetings');
const mail_boxes = require('./modules/mail_boxes');
const comments = require('./modules/comments');
const terminals = require('./modules/terminals');
const versions = require('./modules/versions');
const prison_terms = require('./modules/prison_terms');
const items = require('./modules/items');
const orders = require('./modules/orders');
const line_items = require('./modules/line_items');
const news = require('./modules/news');
const prison_reward_punishment = require('./modules/prison_reward_punishment');
const prisoner_orders = require('./modules/prisoner_orders');
const prisoner_order_details = require('./modules/prisoner_order_details');

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

    //获取家属信息的模型
    getFamilies() {
        return this.families;
    }

    //获取罪犯账户的模型
    getAccounts() {
        return this.accounts;
    }

    //获取罪犯账户明细的模型
    getAccountDetail() {
        return this.account_details;
    }

    //获取家属会见的模型
    getMeetings() {
        return this.meetings;
    }

    //获取监狱长邮箱的模型
    getMailBoxes() {
        return this.mail_boxes;
    }

    //获取监狱长邮箱回复的模型
    getComments() {
        return this.comments;
    }

    //获取设备终端的模型
    getTerminals() {
        return this.terminals;
    }

    //获取app版本信息的模型
    getVersions() {
        return this.versions;
    }

    //获取刑期变动的模型
    getPrisonTerms() {
        return this.prison_terms;
    }

    //获取商品信息的模型
    getItems() {
        return this.items;
    }

    //获取订单信息的模型
    getOrders() {
        return this.orders;
    }

    //获取商品订单的模型
    getLineItems() {
        return this.line_items;
    }

    //获取新闻信息的模型
    getNews() {
        return this.news;
    }

    //获取罪犯奖惩的模型
    getPrisonReward() {
        return this.prison_reward_punishment;
    }

    //获取罪犯订单的模型
    getPrisonerOrders() {
        return this.prisoner_orders;
    }

    //获取罪犯订单明细的模型
    getPrisonerOrderDetails() {
        return this.prisoner_order_details;
    }
}

let database = new DataBase({
    users,
    registrations,
    jails,
    prisoners,
    families,
    accounts,
    account_details,
    meetings,
    mail_boxes,
    comments,
    terminals,
    versions,
    prison_terms,
    items,
    orders,
    line_items,
    news,
    prison_reward_punishment,
    prisoner_orders,
    prisoner_order_details
});

//连接数据库
database.connect(mongoose, config);

module.exports = database;

