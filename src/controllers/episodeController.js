import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import episodeModel from '../models/episodeModel.js';

const createEpisode =async(req, res)=>{
    try {
        const data = await episodeModel.create(req.body);
        const { _id, name, season_id, thumbnail_id, description } = data;
        postResponseSuccess({ res, data : {_id, name, season_id, thumbnail_id, description}, message : 'episode created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getEpisode =async(req, res)=>{
    try {
        const id = req.params.id;

        const data = await episodeModel.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});

        if(!data) {
            return errorResponse({res, message : 'episode does not exist!'})
        }

        getResponseSuccess({res, data, message : 'episode fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const updateEpisode =async(req, res)=>{
    try {
        const id = req.params.id;
        const isEpisodeExist = await episodeModel.findOne({_id : id, is_deleted : false});

        if(!isEpisodeExist) {
            return errorResponse({res, message : 'episode does not exist!'})
        }
        
        const data = await episodeModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v');
        updateResponseSuccess({res, data, message: 'episode updated successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteEpisode =async(req, res)=>{
    try {
        const id = req.params.id;
        await episodeModel.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'episode deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createEpisode, getEpisode, updateEpisode, deleteEpisode  };