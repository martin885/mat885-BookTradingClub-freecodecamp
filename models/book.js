const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const BookSchema=new Schema({
    title:String,
    author:String,
    publisher:String,
    description:String,
    link:String,
    imageUrl:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
     
     
        enum:['available','pending'],
        default:'available'
    }
});

const Book=mongoose.model('Book',BookSchema);
module.exports=Book;