import mongoose from "mongoose";

const schemaStructure = {
    name : { type : String, required : true },
    description : { type : String, required : true },
    tailer_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'File' },
    thumbnail_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'File' },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure);
const model = mongoose.model('Series', schema);

export default model;