const mongoose = require('mongoose');
const util = require('../../util');

let line_items = mongoose.Schema({
	id:{type:Number,required:true,unique:true},//商品订单id
	item_id:{type:Number,default:''},//商品id
	order_id:{type:Number,default:''},//订单id
	quantity:{type:Number,default:0},//数量
	created_at:{type:Date,default:Date.now},//创建时间
	updated_at:{type:Date,default:Date.now}//更新时间
});

line_items.statics = {
	//根据订单id查询商品订单
	findByOrderId(id=''){
		let self = this;
		return new Promise((resolve,reject)=>{
			self.find({order_id:id},{'_id':0,'__v':0},(e,doc)=>{
				if(e){
					console.log(e);
					reject(e);
				}else resolve(util.transformArr(doc));
			});
		});
	},
	//新增商品订单
	createLineItems(...field){
		let self = this;
		return new Promise((resolve,reject)=>{
			self.insertMany(field,(e,doc)=>{
				if(e){
					console.log(e);
					reject(doc);
				}else resolve(util.transformArr(doc));
			});
		});
	}
};

module.exports = mongoose.model('line_items',line_items);