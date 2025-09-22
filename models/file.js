const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    filename:{type:String,required:true,default:'NewFolder'},
    url:{type:String,required:true},
    folder:{type:mongoose.Schema.Types.ObjectId,ref:"Folder"},
    createdAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model("File",fileSchema)


