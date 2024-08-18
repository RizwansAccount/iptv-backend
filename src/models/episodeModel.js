import mongoose from "mongoose";

const schemaStructure = {
    name : { type : String, required : true },
    description : { type : String, required : true },
    season_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Season' },
    thumbnail_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'File' },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure, { timestamps : true });
const model = mongoose.model('Episode', schema);

export default model;