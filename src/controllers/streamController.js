import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import streamModel from '../models/streamModel.js';

const createStream =async(req, res)=>{
    try {
        const data = await streamModel.create(req.body);
        const { _id, user_id, episode_id, time } = data;
        postResponseSuccess({res, data : { _id, user_id, episode_id, time}, message : 'stream created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getStream =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await streamModel.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});
        if(!data) {
            return errorResponse({res, message : 'stream does not exist!'})
        };
        getResponseSuccess({res, data, message : 'stream fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const updateStream =async(req, res)=>{
    try {
        const id = req.params.id;
        const isStreamExist = await streamModel.findOne({_id : id, is_deleted : false});
        if(!isStreamExist) {
            return errorResponse({res, message : 'stream does not exist!'})
        };
        const data = await streamModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v');
        updateResponseSuccess({res, data, message: 'stream updated successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteStream =async(req, res)=>{
    try {
        const id = req.params.id;
        await streamModel.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'stream deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createStream, getStream, updateStream, deleteStream };