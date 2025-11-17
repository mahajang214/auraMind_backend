const mongoose=require("mongoose");

const ikigaiSchema=new mongoose.Schema({
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:"UserModal",required:true},
    data:{
        passion:[{type:String,required:true}],
        mission:[{type:String,required:true}],
        vocation:[{type:String,required:true}],
        profession:[{type:String,required:true}],
    },
    whatYouLove:{type:String,required:true},
    whatTheWorldNeeds:{type:String,required:true},
    whatYouAreGoodAt:{type:String,required:true},
    whatYouCanBePayedFor:{type:String,required:true},

},{timestamps:true});

const IkigaiModal=mongoose.model("IkigaiModal",ikigaiSchema);
module.exports=IkigaiModal;