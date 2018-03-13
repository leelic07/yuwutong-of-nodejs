/**
 * Created by Administrator on 2018/3/6/006.
 */
const db = require('../../model');
const util = require('../../util');

class Prisoners {
    constructor() {
    }

    //获取服刑人员信息列表
    async prisoners(ctx, next) {
        // await db.getPrisoners().createPrisoners({
        //     id: 1,
        //     prisoner_number: '410000',
        //     name: '王世充',
        //     gender: '男',
        //     crimes: '强奸',
        //     additional_punishment: '剥夺政治权利',
        //     original_sentence: '强奸罪',
        //     jail_id: 1,
        //     prison_term_started_at: 1399935986349,
        //     prison_term_ended_at: 1499935986349,
        //     prison_area: '一监区',
        // }, {
        //     id: 2,
        //     prisoner_number: '410001',
        //     name: '蔡安阳',
        //     gender: '男',
        //     crimes: '偷窃',
        //     additional_punishment: '剥夺政治权利',
        //     original_sentence: '偷窃罪',
        //     jail_id: 1,
        //     prison_term_started_at: 1399935986349,
        //     prison_term_ended_at: 1499935986349,
        //     prison_area: '二监区',
        // }, {
        //     id: 3,
        //     prisoner_number: '410002',
        //     name: '张小明',
        //     gender: '男',
        //     crimes: '抢劫',
        //     additional_punishment: '剥夺政治权利',
        //     original_sentence: '抢劫罪',
        //     jail_id: 1,
        //     prison_term_started_at: 1399935986349,
        //     prison_term_ended_at: 1499935986349,
        //     prison_area: '二监区',
        // }).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '新增服刑人员成功',
        //             data: result
        //         }
        //     } else ctx.body = {
        //         code: 500,
        //         msg: '新增服刑人员失败',
        //         data: ''
        //     }
        // }).catch(err => ctx.throw(err.status || 500, err.message));

        let size;//服刑人员信息列表的总记录数
        let prisonersList = [];//罪犯信息列表
        let familiesList = [];//家属信息列表
        await db.getPrisoners().findPage(ctx.request).then(async prisoners => {
            if (prisoners.length) {
                await db.getPrisoners().findTotal(ctx.request).then(total => size = total).catch(err => ctx.throw(err.status || 500, err.message));
                prisonersList = prisoners;
                console.log('prisonersList', prisoners);
            } else ctx.body = {
                code: 404,
                msg: '未找到服刑人员信息',
                data: {}
            }
        }).catch(err => ctx.throw(err.status || 500, err.message));
        //查询家属信息列表
        await db.getFamilies().findFamilies().then(families => {
            if (families.length) {
                familiesList = families;
            } else ctx.body = {
                code: 404,
                msg: '未找到家属信息',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
        //将对应相同的罪犯的家属信息加入到罪犯列表当中
        prisonersList.forEach(prisoner => {
            prisoner.families = familiesList.filter(family => family.prisonerId === prisoner.id);
        });
        if (prisonersList.length) ctx.body = {
            code: 200,
            msg: '查询服刑人员信息成功',
            data: {
                prisoners: prisonersList,
                prisonersSize: size ? size : 0
            }
        }; else ctx.body = {
            code: 404,
            msg: '未找到服刑人员信息',
            data: {}
        }
    }

    //处理上传的罪犯模板
    async processing(ctx, next) {
        let data = util.excelparser(ctx.request.query.filepath);
        let dataTemp = [];
        // let prisoner_numbers = [];
        // let prisonersList = [];//新增或修改的罪犯列表
        for (let i = 1; i < data.length; i++) {
            let param = data[i];
            // prisoner_numbers.push(param[0]);
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

        await db.getPrisoners().parsePrisoners(...dataTemp).then(prisoners => {
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
            };
        }).catch(err => ctx.throw(500, err.message));

        // let prisoner;
        // let newPrisoners = [];
        // await db.getPrisoners().findByPrisonerNumbers(prisoner_numbers).then(prisoners => {
        //     if (prisoners.length) {
        //         dataTemp.forEach(data => {
        //             prisoner = prisoners.find(prisoner => data.prisoner_number === prisoner.prisoner_number);
        //             if (prisoner) {
        //                 Object.assign(prisoner, data);
        //                 prisoner.save((e, doc) => e && (ctx.throw(500, err.message)));
        //             } else newPrisoners.push(data);
        //         });
        //     } else {
        //         db.getPrisoners().parsePrisoners(dataTemp).then(prisoners => {
        //             if (prisoners.length) {
        //                 ctx.body = {
        //                     code: 200,
        //                     msg: '解析文件成功',
        //                     data: {
        //                         prisoners: prisoners
        //                     }
        //                 }
        //             } else {
        //                 ctx.body = {
        //                     code: 500,
        //                     msg: '解析文件失败',
        //                     data: {}
        //                 }
        //             }
        //         });
        //     }
        // }).catch(err => ctx.throw(500, err.message));
        //
        // if (newPrisoners.length) {
        //     await db.getPrisoners().parsePrisoners(newPrisoners).then(prisoners => {
        //         if (prisoners.length) {
        //             ctx.body = {
        //                 code: 200,
        //                 msg: '解析文件成功',
        //                 data: {
        //                     prisoners: prisoners
        //                 }
        //             }
        //         } else {
        //             ctx.body = {
        //                 code: 500,
        //                 msg: '解析文件失败',
        //                 data: {}
        //             }
        //         }
        //     }).catch(err => ctx.throw(500, err.message));
        // }

        // await dataTemp.forEach(data => {
        //     db.getPrisoners().findOne({prisoner_number: data.prisoner_number}, (err, doc) => {
        //         if (err) ctx.throw(500, err.message);
        //         else {
        //             if (doc) {
        //                 ctx.body = {
        //                     code: 200,
        //                     msg: '有记录'
        //                 }
        //             } else ctx.body = {
        //                 code: 404,
        //                 msg: '没有记录'
        //             }
        //         }

        // else {
        //     if (doc) {
        //         Object.assign(doc, data);
        //         doc.save((err, doc) => {
        //             if (err) ctx.throw(500, err.message);
        //             else {
        //                 if (doc) {
        //                     // ctx.body = {
        //                     //     code: 200,
        //                     //     msg: '解析文件成功',
        //                     //     data: {
        //                     //         prisoners: doc
        //                     //     }
        //                     // }
        //                     prisonersList.push(data);
        //                 } else {
        //                     ctx.body = {
        //                         code: 500,
        //                         msg: '修改罪犯数据失败'
        //                     }
        //                 }
        //             }
        //         });
        //     } else {
        //         db.getPrisoners().parsePrisoners(data).then(prisoners => {
        //             if (prisoners.length) prisonersList.push(data);
        //             // ctx.body = {
        //             //     code: 200,
        //             //     msg: '解析文件成功',
        //             //     data: {
        //             //         prisoners: prisoners[0]
        //             //     }
        //             // };
        //             else ctx.body = {
        //                 code: 500,
        //                 msg: '新增罪犯数据失败'
        //             }
        //         }).catch(err => ctx.throw(500, err.message));
        //     }
        // }
        //     });
        // });
        // if (prisonersList.length) {
        //     ctx.body = {
        //         code: 200,
        //         msg: '解析文件成功',
        //         data: {}
        //     }
        // } else ctx.body = {
        //     code: 500,
        //     msg: '解析文件失败'
        // }
    }
}

module.exports = new Prisoners();
