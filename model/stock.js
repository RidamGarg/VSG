const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const StockSchema = new Schema({
    name:String,
    price:Number,
    date:String,
    volume:Number,
    average:Number,
    time:String
})
module.exports = mongoose.model('Stock',StockSchema)