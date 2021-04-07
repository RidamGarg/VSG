const mongoose = require('mongoose');
const passportLocalMoongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema ;
const UserSchema = new Schema({
   email:{
       type:String,
       required:true,
       unique:true
   },
   trades:[{
    type:Schema.Types.ObjectId,
    ref:'Stock'
   }]
}) 
UserSchema.plugin(passportLocalMoongoose);
module.exports = mongoose.model('User',UserSchema)