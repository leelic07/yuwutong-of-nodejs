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
        let req = ctx.request;
        for (let i = 1; i < data.length; i++) {
            let param = data[i];
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

        await dataTemp.forEach(data => {
            db.getPrisoners().findOne({
                prisoner_number: data.prisoner_number,
                jail_id: req.user.jail_id
            }, (err, prisoner) => {
                if (err) ctx.throw(500, err.message);
                else {
                    if (prisoner) {
                        data.prisoner_id = prisoner.id;
                    }
                }
            })
        });
        let success = 0;//成功的条数
        let failed = 0;//失败的条数
        await dataTemp.forEach(data => {
            if (data['prisoner_id']) {
                db.getPrisonTerms().update({prisoner_id: data['prisoner_id']}, data, (err, doc) => {
                    if (err) ctx.throw(500, err.message);
                    else doc && ++success || ++failed;
                });
            } else ++failed;
            // {
            //     await db.getPrisonTerms().findOne().sort({id: -1}).exec(async (err, doc) => {
            //         if (err) ctx.throw(500, err.message);
            //         else {
            //             if (doc) {
            //                 data.id = ++doc.id;
            //                 await db.getPrisonTerms().update();
            //             }
            //         }
            //     });
            // }
        });

        if (success !== 0 || failed !== 0) {
            ctx.body = {
                code: 200,
                msg: '解析文件成功',
                data: {
                    success: success,
                    failed: success
                }
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '解析文件失败',
                data: {
                    success: success,
                    failed: failed
                }
            }
        }
    }
}

module.exports = new PrisonTerms();