import mongoose from "mongoose";

const schemaStructure = {
    original_name : { type : String, required : true },
    current_name : { type : String, required : true },
    type : { type : String, required : true },
    path : { type : String, required : true },
    size : { type : Number, required : true },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure);
const model = mongoose.model('File', schema);

export default model;