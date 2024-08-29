import mongoose from "mongoose";

const schemaStructure = {
    first_name : { type : String, required : true },
    last_name : { type : String, required : true },
    email : { type : String, required : true, },
    password : { type : String, required : true },
    verification_code : { type : String, required : true }
};

const schema = new mongoose.Schema(schemaStructure, { timestamps : true });
const model = mongoose.model('Code', schema);

export default model;