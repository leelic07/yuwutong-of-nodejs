/**
 * Created by Administrator on 2018/3/19/019.
 */
const db = require('../../model');

class PrisonerOrders {
    constructor() {
    }

    //解析罪犯订单的excel文件
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
                status: param[0],
                ifreceive: param[1],
                created_at: param[2],
                trade_no: param[3],
                order_details: param[4],

            });
        }
    }
}

module.exports = new PrisonerOrders();