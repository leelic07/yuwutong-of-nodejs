/**
 * Created by Administrator on 2018/3/6/006.
 */
module.exports = {
    //将下划线转化成驼峰
    transformStr(str){
        let re = /_(\w)/g;
        return str.replace(re, ($0, $1) => $1.toUpperCase());
    },
    //将对象数组中的所有的下划线字符串都转换成驼峰字符串
    transformArr(arr){
        let newArr = [];
        arr.forEach(item => {
            let doc = item._doc;
            let docTemp = {};
            for (let key in doc) {
                // doc[key] = typeof doc[key] === 'object' ? this.transformObj(doc[key]) : doc[key];
                docTemp[this.transformStr(key)] = doc[key];
            }
            newArr.push(docTemp);
        });
        return newArr;
    },
    //将对象中的所有的下划线字符串都转换成驼峰字符串
    transformObj(obj){
        let doc = obj._doc;
        let docTemp = {};
        for (let key in doc) {
            docTemp[this.transformStr(key)] = doc[key];
        }
        return docTemp;
    }
};