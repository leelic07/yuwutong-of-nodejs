/**
 * Created by Administrator on 2018/3/2/002.
 */
class Users {
    constructor() {
    }

    //获取登录的用户信息
    async users(ctx, next) {
        ctx.request.users && (ctx.body = {
            code: 200,
            msg: '获取用户信息成功',
            result: {users: ctx.request.users}
        });
    }
}

let users = new Users();

module.exports = users;