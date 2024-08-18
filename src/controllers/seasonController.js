import mongoose from "mongoose";
import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import seasonModel from '../models/seasonModel.js';
import paginationPipeline from "../config/paginationPipeline.js";

const createSeason =async(req, res)=>{
    try {
        const data = await seasonModel.create(req.body);
        const { _id, name, series_id, description } = data;
        postResponseSuccess({ res, data : {_id, name, series_id, description}, message : 'season created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllSeasons=async(req, res)=>{
    try {
        const pipeline = paginationPipeline(req);
        const data = await seasonModel.aggregate(pipeline);
        getResponseSuccess({res, data, message : 'fetch all seasons successfully!'})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getSeason =async(req, res)=>{
    try {
        const id = req.params.id;

        const data = await seasonModel.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});

        if(!data) {
            return errorResponse({res, message : 'season does not exist!'})
        }

        getResponseSuccess({res, data, message : 'season fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllEpisodesBySeasonId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await seasonModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'episodes',
                    localField : '_id',
                    foreignField : 'season_id',
                    as : 'episodes'
                }
            },
            {
                $project : {
                    episodes : {
                        $filter : {
                            input : '$episodes',
                            as : 'episode',
                            cond : { $eq: ['$$episode.is_deleted', false] }
                        }
                    },
                    _id : 0
                }
            },
            {
                $project : {
                    episodes : {
                        $map : {
                            input : '$episodes',
                            as : 'episode',
                            in : {
                                '_id' :  '$$episode._id',
                                'name' : '$$episode.name',
                                'description' : '$$episode.description'
                            }
                        }
                    },
                    _id : 0
                }
            }
        ]);
        getResponseSuccess({res, data : data?.[0] || { episodes : [] }, message : 'fetch all episodes of this season successfully!'})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const updateSeason =async(req, res)=>{
    try {
        const id = req.params.id;
        const isSeasonExist = await seasonModel.findOne({_id : id, is_deleted : false});

        if(!isSeasonExist) {
            return errorResponse({res, message : 'season does not exist!'})
        }
        
        const data = await seasonModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v');
        updateResponseSuccess({res, data, message: 'season updated successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteSeason =async(req, res)=>{
    try {
        const id = req.params.id;
        await seasonModel.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'season deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createSeason, getSeason, updateSeason, deleteSeason, getAllSeasons, getAllEpisodesBySeasonId };