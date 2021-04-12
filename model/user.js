const mongoose = require('mongoose');
const passportLocalMoongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema ;
const StockSchema = new Schema({
    name:String,
    price:Number,
    date:String,
    volume:Number,
    average:Number,
    time:String
})
const UserSchema = new Schema({
   email:{
       type:String,
       required:true,
       unique:true
   },
   trades:[StockSchema]
}) 
UserSchema.plugin(passportLocalMoongoose);
module.exports = mongoose.model('User',UserSchema)