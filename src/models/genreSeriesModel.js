import mongoose from "mongoose";

const schemaStructure = {
    genre_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Genre' },
    series_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Series' },
    is_deleted : { type : Boolean, default : false }
};

const schema = new mongoose.Schema(schemaStructure, { timestamps : true });
const model = mongoose.model('GenreSeries', schema);

export default model;