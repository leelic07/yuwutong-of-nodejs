/**
 * Created by Administrator on 2018/3/19/019.
 */
const mongoose = require('mongoose');

let prison_reward_punishment = mongoose.Schema({
    id: {type: Number, required: true, unique: true},//罪犯奖惩id
    prisoner_id: {type: Number, ref: 'prisoners'},//罪犯id
    datayear: {type: String, default: ''},//奖惩时间
    ndry: {type: String, default: ''},//奖惩内容
    rp_type: {type: Number, default: ''},//监狱编号
    created_at: {type: Date, default: Date.now},//创建时间
    updated_at: {type: Date, default: Date.now}//更新时间
});

prison_reward_punishment.statics = {
    //解析刑期变动excel信息
    parsePrisonReward(field = []) {
        let self = this;
        let id = 0;
        return new Promise((resolve, reject) => {
            self.findOne().sort({id: -1}).exec((e, doc) => {
                if (e) reject(e);
                else {
                    if (doc) field.forEach(f => f.id = ++doc.id);
                    else field.forEach(f => f.id = ++id);
                    self.insertMany(field, (e, doc) => {
                        if (e) {
                            console.log(e);
                            reject(e);
                        } else resolve(doc);
                    });
                }
            });
        });
    },
};

module.exports = mongoose.model('prison_reward_punishment', prison_reward_punishment);