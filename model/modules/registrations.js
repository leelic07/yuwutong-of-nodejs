/**
 * Created by Administrator on 2018/3/2/002.
 */
let mongoose = require('mongoose');

//犯人家属注册表
let registrations = new mongoose.Schema({
    jail_id: Number,//监狱id
    name: String,//家属名称
    phone: String,//联系电话
    uuid: String,
    create_at: {type: Date, default: Date.now()},//创建时间
    update_at: {type: Date, default: Date.now()},//更新时间
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
    find(condition = {}, field = {}, options = {}) {
        let self = this;
        let page = condition.page, limit = condition.limit;
        let start = (page - 1) * limit > 0 ? (page - 1) * limit : 0;
        delete condition.page;
        delete condition.limit;
        return new Promise((resolve, reject) => {
            self.registration.find(condition, field, options).start(start).limit(limit).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }

    //增加家属注册信息
    create(...field) {
        let self = this;
        return new Promise((resolve, reject) => {
            typeof field === 'object' && (field = [].push(field));
            self.registration.create(...field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            })
        });
    }
}

module.exports = new Registrations();