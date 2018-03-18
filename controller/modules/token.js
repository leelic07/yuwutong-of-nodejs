/**
 * Created by Administrator on 2018/3/2/002.
 */
const db = require('../../model');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class Token {
    constructor() {
    }

    //生成token信息
    async authentication(ctx, next) {
        // await db.getUsers().create(
        //     {
        //         id: 4,
        //         username: '孙六',
        //         salt: '4501_sp',
        //         hashed_password: '123456',
        //         role: 2,
        //         jail_id: 1
        //     }, {
        //         id: 5,
        //         username: '陈七',
        //         salt: '4501_xx',
        //         hashed_password: '123456',
        //         role: 3,
        //         jail_id: 1
        //     }
        // {
        //     id: 1,
        //     username: '张三',
        //     salt: '4501_sh',
        //     hashed_password: '123456',
        //     role: 1,
        //     jail_id: 1
        // },
        //     {
        //     id: 2,
        //     username: '李四',
        //     salt: '4502_sp',
        //     hashed_password: '123456',
        //     role: 1,
        //     jail_id: 2,
        // }, {
        //     id: 3,
        //     username: '王五',
        //     salt: '4503_xx',
        //     hashed_password: '123456',
        //     role: 1,
        //     jail_id: 3,
        // }
        // ).then(result => {
        //     if (result) {
        //         ctx.body = {
        //             code: 200,
        //             msg: '添加用户成功',
        //             data: result
        //         }
        //     } else {
        //         ctx.body = {
        //             code: 500,
        //             msg: '添加用户失败',
        //             data: ''
        //         }
        //     }
        // }).catch(err => ctx.throw(err.status | 500, err.message));

        //
        // await db.getJails().create({
        //     id: 1,
        //     prison: '4501',
        //     title: '长沙监狱',
        //     description: '长沙监狱简介',
        //     street: '城南路',
        //     district: '雨花区',
        //     city: '长沙',
        //     state: '湖南',
        //     zipcode: '410005',
        //     accid: '',
        //     image_file_name: '长沙监狱.jpg',
        //     image_content_type: 'jpg',
        //     image_file_size: 1024,
        // }, {
        //     id: 2,
        //     prison: '4502',
        //     title: '英山监狱',
        //     description: '英山监狱简介',
        //     street: '城南路',
        //     district: '雨花区',
        //     city: '英山',
        //     state: '广西',
        //     zipcode: '410005',
        //     accid: '',
        //     image_file_name: '英山监狱.jpg',
        //     image_content_type: 'jpg',
        //     image_file_size: 1024,
        // }).then(result => {
        //     if (result) ctx.body = {
        //         code: 200,
        //         msg: '添加监狱成功',
        //         data: result
        //     };
        //     else ctx.body = {
        //         code: 500,
        //         msg: '添加监狱失败',
        //         data: ''
        //     }
        // }).catch(err => ctx.throw(err.status | 500, err.message));

        let body = ctx.request.body;
        await db.getJails().findJails({prison: body.prison}).then(async jail => {
            if (jail) {
                console.log(jail.title);
                await db.getUsers().findUsers({
                    salt: body.username,
                    hashed_password: body.password,
                    jail_id: Number(jail.id)
                }, {'_id': 0, '__v': 0, hashed_password: 0}).then(user => {
                    if (user) {
                        let token = jwt.sign({
                            jail_id: jail.id,
                            user_id: user.id
                        }, config.secret, {'expiresIn': 7200});
                        ctx.body = {
                            code: 200,
                            msg: '登录成功',
                            data: {
                                token: token,
                                users: Object.assign(user, {
                                    jailName: jail.title
                                })
                            }
                        }
                    } else ctx.body = {
                        code: 404,
                        msg: '用户账号或者密码不正确',
                        data: ''
                    }
                }).catch(err => ctx.throw(500, err.message));
            } else ctx.body = {
                code: 404,
                msg: '用户不存在',
                data: ''
            }
        }).catch(err => ctx.throw(500, err.message));
    }

    //验证token
    async verifyToken(ctx, next) {
        let decode;
        // console.log(ctx.originalUrl);
        if (ctx.originalUrl === '/users/login' || /^\/public/.test(ctx.originalUrl)) await next();
        else {
            //检查post的信息或者url查询参数或者头信息
            let token = ctx.request.body.token || ctx.request.query.token || ctx.request.header['authorization'];
            // 解析 token
            if (token) {
                // 确认token
                jwt.verify(token, config.secret, async (err, decoded) => {
                    // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                    if (!err) {
                        ctx.request.user = decoded;
                        decode = decoded;
                    }
                });
                if (decode) await next();
                else ctx.throw(403, '用户未授权或者授权超时，请重新登录');
            } else ctx.throw(403, '用户没有授权');// 如果没有token，则返回错误
        }
    }

    //退出登录
    async logout(ctx, next) {
        // let token = jwt.sign(ctx.request.user, 'logout', {'expiresIn': 7200});
        // if (token)
        ctx.body = {
            code: 200,
            msg: '退出登录成功',
            data: {}
            // }; else ctx.body = {
            //     code: 500,
            //     msg: '退出登录失败',
            //     data: {}
        }
    }
}

module.exports = new Token();
