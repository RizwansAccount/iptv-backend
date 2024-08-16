import mongoose from "mongoose";
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

const getAllEpisodes=async(req, res)=>{
    try {
        const data = await episodeModel.find({ is_deleted : false }, { is_deleted : 0, __v : 0 });
        getResponseSuccess({ res, data, message:'all episodes successfully!' });
    } catch ({message}) {
        errorResponse({res, message})
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

const getAllStreamsByEpisodeId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await episodeModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id), is_deleted: false }
            },
            {
                $lookup: {
                    from: 'streams',
                    localField: '_id',
                    foreignField: 'episode_id',
                    as: 'streams'
                }
            },
            {
                $project: {
                    episodes: {
                        $filter: {
                            input: '$streams',
                            as: 'stream',
                            cond: { $eq: ['$$stream.is_deleted', false] }
                        }
                    },
                    _id: 0
                }
            },
            {
                $project: {
                    episodes: {
                        $map: {
                            input: '$episodes',
                            as: 'episode',
                            in: {
                                '_id': '$$episode._id',
                                'user_id': '$$episode.user_id',
                                'time': '$$episode.time'
                            }
                        }
                    }
                }
            }
        ]);
        getResponseSuccess({ res, data: data?.[0], message: 'get all Streams by episode id' })
    } catch ({ message }) {
        errorResponse({ res, message })
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

export { createEpisode, getEpisode, updateEpisode, deleteEpisode, getAllEpisodes, getAllStreamsByEpisodeId  };