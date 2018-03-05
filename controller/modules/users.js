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
        await db.getUsers().find({id: user.user_id}, {role: 1, id: 1, '_id': 0, '__v': 0}).then(user => {
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
}

let users = new Users();

module.exports = users;