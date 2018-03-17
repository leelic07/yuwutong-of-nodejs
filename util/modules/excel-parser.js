/**
 * Created by Administrator on 2018/3/12/012.
 */
const xlsx = require('node-xlsx');
const fs = require('fs');

module.exports = function (filePath) {
    //读取文件内容
    let obj = xlsx.parse(filePath);
    let excelObj = obj[0].data;
    // console.log(excelObj);

    // let data = [];
    // for (let i in excelObj) {
    //     let arr = [];
    //     let value = excelObj[i];
    //     for (let j in value) {
    //         arr.push(value[j] ? value[j] : 'null');
    //     }
    //     data.push(arr);
    // }
    //
    // let buffer = xlsx.build([{
    //     name: 'sheet1',
    //     data: data
    // }]);

    //将文件内容插入新的文件中
    // fs.writeFileSync(filePath, buffer, {'flag': 'w'});
    return excelObj;
};

