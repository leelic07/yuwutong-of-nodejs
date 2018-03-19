/**
 * Created by Administrator on 2018/3/19/019.
 */
const db = require('../../model');
const util = require('../../util');

class PrisonRewardPunishment {
    constructor() {
    }

    //解析罪罚奖惩的excel
    async processing(ctx, next) {
        let data = util.excelparser(ctx.request.query.filepath);
        let dataTemp = [];
        let prisonerNumbers = [];
        let prison = '';//监狱部门代号
        for (let i = 1; i < data.length; i++) {
            let param = data[i];
            prisonerNumbers.push(param[0]);
            prison = param[4];
            dataTemp.push({
                prisoner_number: param[0].toString(),
                name: param[1],
                datayear: param[2],
                ndry: param[3]
            });
        }

        let prisonRewardPunishment = [];//过滤后的罪犯奖惩信息列表
        await db.getJails().findJails({prison: prison}).then(async jail => {
            if (jail) {
                await db.getPrisoners().findByPrisonerNumbers(prisonerNumbers).then(async prisonersList => {
                    if (prisonersList.length) {
                        dataTemp.forEach(data => {
                            let prisoner = prisonersList.find(prisoner => prisoner.prisoner_number === data.prisoner_number);
                            if (prisoner) {
                                data.prisoner_id = prisoner.id;
                                prisonRewardPunishment.push(data);
                            }
                        });
                        await db.getPrisonReward().parsePrisonReward(prisonRewardPunishment).then(prisonReward => {
                            if (prisonReward.length) ctx.body = {
                                code: 200,
                                msg: '解析文件成功',
                                data: {
                                    add_total: prisonReward.length,
                                    success_total: prisonReward.length,
                                    update_total: 0
                                }
                            }; else ctx.body = {
                                code: 500,
                                msg: '解析文件失败',
                                data: {}
                            }
                        }).catch(err => ctx.throw(500, err.message));
                    } else ctx.body = {
                        code: 404,
                        msg: '未找到对应罪犯',
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

module.exports = new PrisonRewardPunishment();