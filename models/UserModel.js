
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator'); 


var UserSchema = new Schema({
    'username' : {type:String, required:true},
    'firstname' : {type:String, required:false},
    'lastname' : {type:String, required:false},
    'email' : {type:String, required:true, unique :true},
    'password' : {type:String, required:true},
    'avatar' : {type:String, required:false},
    'createdAt' : {type:Date, default:Date.now()},
})

UserSchema.plugin(uniqueValidator); 
module.exports=mongoose.model('User', UserSchema)
