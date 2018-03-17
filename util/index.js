/**
 * Created by Administrator on 2018/3/6/006.
 */
const transformStr = require('./modules/transformStr');
const fileuploads = require('./modules/fileuploads');
const excelparser = require('./modules/excel-parser');

module.exports = {
    ...transformStr,
    fileuploads,
    excelparser
};