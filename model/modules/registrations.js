/**
 * Created by Administrator on 2018/3/2/002.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//犯人家属注册表
let registrations = new Schema({
    id: Schema.Types.ObjectId,//家属注册id
    jail_id: {type: Schema.Types.ObjectId, ref: 'jails'},//监狱id
    name: String,//家属名称
    phone: String,//联系电话
    uuid: String,
    create_at: {type: Date, default: Date.now},//创建时间
    update_at: {type: Date, default: Date.now},//更新时间
    prisoner_number: String,//犯人编号
    relationship: String,//关系
    status: {type: String, default: 'PENDING'},//状态(默认值,PENDING),PENDING:授权中;DENIED:驳回;PASSED:已通过
    remarks: String,//备注
    gender: String//性别
});

class Registrations {
    constructor() {
        this.registration = mongoose.model('registrations', registrations);
    }

    //分页查询家属注册列表
    findPage(condition = {}, field = {}, options = {}) {
        let self = this;
        let page = Number(options.page), rows = Number(options.rows);
        page = page ? page : 1;
        rows = rows ? rows : 10;
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        return new Promise((resolve, reject) => {
            self.registration.find(condition, field, {$skip: start, $limit: limit}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }

    //查询所有家属注册列表的记录数
    findTotal(condition = {}, field = {}, options = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.registration.find(condition, field, options, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc.length);
            });
        });
    }

    //增加家属注册信息
    create(field = {}) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.registration.create(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
}

module.exports = new Registrations();