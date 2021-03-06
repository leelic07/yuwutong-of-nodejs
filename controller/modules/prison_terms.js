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
        let prisonerNumbers = [];
        let prison = '';//监狱部门代号
        for (let i = 1; i < data.length; i++) {
            let param = data[i];
            prisonerNumbers.push(param[0]);
            prison = param[9];
            dataTemp.push({
                prisoner_number: param[0].toString(),
                updated_at: param[1],
                changetype: param[2],
                sentence: param[3],
                courtchange: param[4],
                changeyear: param[5],
                changemonth: param[6],
                changeday: param[7],
                term_finish: param[8],
            });
        }

        let prisonerTermsList = [];//罪犯编号存在的罪犯刑期变动信息
        await db.getJails().findJails({prison: prison}).then(async jail => {
            if (jail) {
                await db.getPrisoners().findByPrisonerNumbers(prisonerNumbers).then(async prisonersList => {
                    if (prisonersList.length) {
                        dataTemp.forEach(data => {
                            let prisoner = prisonersList.find(prisoner => prisoner.prisoner_number === data.prisoner_number);
                            if (prisoner) {
                                data.prisoner_id = prisoner.id;
                                prisonerTermsList.push(data);
                            }
                        });
                        await db.getPrisonTerms().parsePrisonTerms(prisonerTermsList).then(prisonTerms => {
                            if (prisonTerms.length) ctx.body = {
                                code: 200,
                                msg: "解析文件成功",
                                data: {
                                    add_total: prisonTerms.length,
                                    success_total: prisonTerms.length,
                                    update_total: 0
                                }
                            }
                        }).catch(err => ctx.throw(500, err.message));
                    } else ctx.body = {
                        code: 404,
                        msg: "未找到对应罪犯",
                        data: {}
                    }
                }).catch(err => ctx.throw(500, err.message));
            } else ctx.body = {
                code: 404,
                msg: '未找到对应部门',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new PrisonTerms();