/**
 * Created by Administrator on 2018/3/2/002.
 */
const db = require('../../model');

class Users {
    constructor() {
    }

    //获取登录的用户信息
    async users(ctx, next) {
        let users = ctx.request.users;
        ctx.body = {
            code: 200,
            msg: '获取用户信息成功',
            result: {
                users: {
                    username: users.username,
                    salt: users.salt,
                    role: users.role,
                    jail_id: users.jail_id,
                    _id: users._id
                }
            }
        }
    }
}

let users = new Users();

module.exports = users;