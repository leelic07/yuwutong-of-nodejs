/**
 * Created by Administrator on 2018/3/2/002.
 */
const db = require('../../model');

class Users {
    constructor() {
    }

    //获取登录的用户信息
    async users(ctx, next) {
        let user = ctx.request.user;
        await db.getUsers().findUsers({id: user.user_id}, {role: 1, id: 1, '_id': 0, '__v': 0}).then(user => {
            if (user.length) {
                ctx.body = {
                    code: 200,
                    msg: '获取用户信息成功',
                    data: {
                        user: user[0]
                    }
                }
            } else ctx.body = {
                code: 500,
                msg: '获取用户信息失败',
                data: ''
            }
        }).catch(err => ctx.throw(err.status || 500, err.message));
        // ctx.body = {
        //     code: 200,
        //     msg: '获取用户信息成功',
        //     result: {
        //         users: {
        //             username: users.username,
        //             salt: users.salt,
        //             role: users.role,
        //             jail_id: users.jail_id,
        //             _id: users._id
        //         }
        //     }
        // }
    }

    //修改账户密码
    async resetPwd(ctx, next) {
        let body = ctx.request.body;
        await db.getUsers().updateUsers({
            id: ctx.request.user.user_id,
            hashed_password: body.old_password
        }, {hashed_password: body.new_password}).then(result => {
            if (result) ctx.body = {
                code: 200,
                msg: '修改用户密码成功',
                data: {}
            }; else ctx.body = {
                code: 500,
                msg: '修改用户密码失败',
                data: {}
            }
        }).catch(err => ctx.throw(500, err.message));
    }
}

module.exports = new Users();
