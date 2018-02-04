const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
const userSchema=mongoose.Schema({
    fullname:{type:String},
    email:{type:String},
    password:{type:String}
});




userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
}




userSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports=mongoose.model('User',userSchema); 