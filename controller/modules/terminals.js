/**
 * Created by Administrator on 2018/3/11 0011.
 */
const db = require('../../model');

class Terminals {
    constructor() {
    }

    //查询设备终端信息列表
    async terminals(ctx, next) {
        // await db.getTerminals().createTerminals({
        //     id: 1,
        //     jail_id: 1,
        //     terminal_number: '9997',
        //     room_number: '41000',
        //     host_password: '123456',
        //     metting_password: '654321',
        // }, {
        //     id: 2,
        //     jail_id: 1,
        //     terminal_number: '9998',
        //     room_number: '41001',
        //     host_password: '123456',
        //     metting_password: '654321',
        // }, {
        //     id: 3,
        //     jail_id: 1,
        //     terminal_number: '9999',
        //     room_number: '41002',
        //     host_password: '123456',
        //     metting_password: '654321',
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加设备终端信息成功',
        //         data: result
        //     }; else ctx.body = {
        //         code: 500,
        //         msg: '添加设备终端信息失败',
        //         data: {}
        //     }
        // }).catch(err => ctx.throw(500, err.message));

        let size;//设备终端信息列表的总记录数
        await db.getTerminals().findPage(ctx.request).then(async terminals => {
            if (terminals.length) {
                await db.getTerminals().countTotal(ctx.request).then(total => size = total).catch();
                ctx.body = {
                    code: 200,
                    msg: '查询设备终端信息成功',
                    data: {
                        terminals: terminals,
                        total: size ? size : 0
                    }
                }
            } else ctx.body = {
                code: 404,
                msg: '未找到设备终端信息',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //编辑设备终端信息
    async edit(ctx, next) {
        console.log(ctx.request.body);
        await db.getTerminals().updateTerminals(ctx.request).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '编辑设备终端信息成功',
                data: result
            }; else ctx.body = {
                code: 500,
                msg: '编辑设备终端信息失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //新增设备终端信息
    async add(ctx, next) {
        await db.getTerminals().addTerminals(ctx.request).then(terminal => {
            if (terminal) ctx.body = {
                code: 200,
                msg: '添加设备终端信息成功',
                data: {
                    terminals: terminal
                }
            }; else ctx.body = {
                code: 500,
                msg: '添加设备终端信息失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new Terminals();