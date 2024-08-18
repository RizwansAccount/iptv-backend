import mongoose from "mongoose";

const schemaStructure = {
    first_name : { type : String, required : true },
    last_name : { type : String, required : true },
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure, { timestamps : true });
const model = mongoose.model('User', schema);

export default model;