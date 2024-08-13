import mongoose from "mongoose";

const schemaStructure = {
    name : { type : String, required : true },
    description : { type : String, required : true },
    series_id : { type : mongoose.SchemaTypes.ObjectId, required : true, ref : 'Series' },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure);
const model = mongoose.model('Season', schema);

export default model;