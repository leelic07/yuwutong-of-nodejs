/**
 * Created by Administrator on 2018/3/11 0011.
 */
class Upload {
    constructor() {
    }

    //上传文件
    async upload(ctx, next) {
        if (ctx.req.file) ctx.body = {
            code: 200,
            msg: '上传文件成功',
            data: {
                filepath: ctx.req.file.path
            }
        }; else ctx.body = {
            code: 500,
            msg: '上传文件失败',
            data: {
                filepath: ''
            }
        }
    }
}

module.exports = new Upload();