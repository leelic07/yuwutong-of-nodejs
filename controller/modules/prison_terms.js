/**
 * Created by Administrator on 2018/3/13/013.
 */
const db = require('../../model');
const util = require('../../util');

class PrisonTerms {
    constructor() {
    }

    //解析刑期变动excel文件
    async processing(ctx, next) {
        let data = util.excelparser(ctx.request.query.filepath);
        let dataTemp = [];
        for (let i = 1; i < data.length; i++) {
            let param = data[i];
            dataTemp.push({
                prisoner_number: param[0].toString(),
                name: param[1],
                gender: param[2],
                crimes: param[3],
                additional_punishment: param[4],
                prison_term_started_at: param[5],
                prison_term_ended_at: param[6],
                prison_area: param[7],
                original_sentence: param[8],
                jail_id: ctx.request.user.jail_id
            });
        }

        await db.getPrisonTerms().parsePrisonTerms(...dataTemp).then(prisoners => {
            if (prisoners.length) ctx.body = {
                code: 200,
                msg: '解析文件成功',
                data: {
                    prisoners: prisoners
                }
            }; else ctx.body = {
                code: 500,
                msg: '解析文件失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new PrisonTerms();