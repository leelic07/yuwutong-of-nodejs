/**
 * Created by Administrator on 2018/3/8/008.
 */
const mongoose = require('mongoose');
const util = require('../../util');

let meetings = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    terminal_id: {type: Number, ref: 'terminals'},
    family_id: {type: Number, ref: 'families'},
    application_date: {type: Date, default: Date.now},
    status: {type: String, default: 'PENDING'},
    meeting_time: {type: Date, default: ''},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    remarks: {type: String, default: ''}
});

meetings.statics = {
    //查询家属会见列表
    findPage(request = {}) {
        let self = this;
        let query = request.query;
        let page = Number(query.page), rows = Number(query.rows);
        let start = (page - 1) * rows > 0 ? (page - 1) * rows : 0;
        return new Promise((resolve, reject) => {
            self.find({}, {'_id': 0, '__v': 0}).skip(start).limit(rows).exec((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(util.transformArr(doc));
            });
        });
    },
    //查询所有家属会见列表的记录数
    findTotal() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.find((e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc.length);
            });
        });
    },
    //新增家属会见信息
    createMeetings(...field){
        let self = this;
        return new Promise((resolve, reject) => {
            self.insertMany(field, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    },
    //修改家属注册信息
    updateMeetings(request = {}) {
        let self = this;
        let body = request.body;
        let condition = body.id ? {id: body.id} : {id: ''};
        delete body.id;
        return new Promise((resolve, reject) => {
            self.update(condition, {updated_at: Date.now(), ...body}, (e, doc) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else resolve(doc);
            });
        });
    }
};

module.exports = mongoose.model('meetings', meetings);