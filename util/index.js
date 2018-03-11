/**
 * Created by Administrator on 2018/3/6/006.
 */
const transformStr = require('./modules/transformStr');
const fileuploads = require('./modules/fileuploads');

module.exports = {
    ...transformStr,
    fileuploads
};