import mongoose from "mongoose";

const schemaStructure = {
    name : { type : String, required : true },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure, { timestamps : true });
const model = mongoose.model('Genre', schema);

export default model;