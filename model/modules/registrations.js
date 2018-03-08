/**
 * Created by Administrator on 2018/3/2/002.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('../../util');
//犯人家属注册表
let registrations = new Schema({
    id: {type: Number, required: true, unique: true},//家属注册id
    jail_id: {type: Number, ref: 'jails'},//监狱id
    name: {type: String, default: ''},//家属名称
    phone: {type: String, default: ''},//联系电话
    uuid: {type: String, default: ''},//身份证
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now},//更新时间
    prisoner_number: {type: String, default: ''},//犯人编号
    relationship: {type: String, default: ''},//关系
    status: {type: String, default: 'PENDING'},//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
    remarks: {type: String, default: ''},//备注
    gender: {type: String, default: ''}//性别
});

class Registrations {
    constructor(mongoose) {
        this.registrations = mongoose.model('registrations', registrations);
    }

    //分页查询家属注册列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        query.uuid ? condition.uuid = query.uuid : '';
        return new Promise((resolve, reject) => {
            self.registrations.find(condition, {'_id': 0, '__v': 0}).skip(start).limit(rows).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            });
        });
    }

    //查询所有家属注册列表的记录数
    findTotal(request = {}) {
        let self = this;
        let query = request.query;
        let condition = {jail_id: request.user.jail_id};
        query.name ? condition.name = query.name : '';
        query.prisonerNumber ? condition.prisoner_number = query.prisonerNumber : '';
        query.uuid ? condition.uuid = query.uuid : '';
        return new Promise((resolve, reject) => {
            self.registrations.find(condition, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc.length);
            });
        });
    }

    //增加家属注册信息
    create(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.registrations.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }

    //修改家属注册信息
    update(request = {}) {
        let self = this;
        let body = request.body;
        let condition = body.id ? {id: body.id} : {id: ''};
        delete body.id;
        return new Promise((resolve, reject) => {
            self.registrations.update(condition, {updated_at: Date.now(), body}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
}

module.exports = new Registrations(mongoose);