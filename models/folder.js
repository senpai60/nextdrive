const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    name:{type:String,required:true,default:'NewFolder'},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:"Folder",default:null},
    createdAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model("Folder",folderSchema)
