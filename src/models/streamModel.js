import mongoose from "mongoose";

const schemaStructure = {
    episode_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Episode'  },
    user_id : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'User' },
    time : { type : String, required : true },
    is_deleted : { type : Boolean, default : false },
};

const schema = new mongoose.Schema(schemaStructure, { timestamps : true });
const model = mongoose.model('Stream', schema);

export default model;