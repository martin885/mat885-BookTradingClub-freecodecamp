const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
const Book=require('./book.js');
const Schema=mongoose.Schema;


const userSchema=new Schema({
    fullname:{type:String},
    email:{type:String},
    password:{type:String},
    city:{type:String},
    state:{type:String},
    addedBooks:[]
});




userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
}




userSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password);
}

const User=mongoose.model('User',userSchema);

module.exports= User;