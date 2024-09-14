import mongoose from "mongoose";
import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../constants/responses.js";
import seriesModel from '../models/seriesModel.js';
import paginationPipeline from "../constants/paginationPipeline.js";

const createSeries =async(req, res)=>{
    try {
        const data = await seriesModel.create(req.body);
        const { _id, name, description, tailer_id, thumbnail_id } = data;
        postResponseSuccess({res, data : { _id, name, description, tailer_id, thumbnail_id}, message : 'series created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllSeries =async(req, res)=>{
    try {
        const pipeline = paginationPipeline(req);
        let data = {};

        if(pipeline?.length > 0) { data = await seriesModel.aggregate(pipeline); }
        else { data = await seriesModel.find(); }

        getResponseSuccess({ res, data, message: 'all series fetch successfully' })
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getSeries =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await seriesModel.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});
        if(!data) {
            return errorResponse({res, message : 'series does not exist!'})
        }
        getResponseSuccess({res, data, message : 'series fetch successfully'});
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllSeasonsBySeriesId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await seriesModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false, }
            },
            {
                $lookup: {
                    from :'seasons',
                    localField: '_id',
                    foreignField:'series_id',
                    as : 'seasons'
                },
            },
            {
                $project : {
                    seasons : {
                        $filter : {
                            input : '$seasons',
                            as : 'season',
                            cond : { $eq : [ '$$season.is_deleted', false ] }
                        }
                    },
                    _id : 0
                }
            },
        ]);
        getResponseSuccess({res, data : data?.[0] || { seasons : [] }, message : 'all seasons fetch successfully by series id'})
       
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getAllEpisodesBySeriesId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await seriesModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false, }
            },
            {
                $lookup: {
                    from :'seasons',
                    localField: '_id',
                    foreignField:'series_id',
                    as : 'seasons',
                },
            },
            {
                $unwind : '$seasons' 
            }, 
            {
                $lookup : {
                    from : 'episodes',
                    localField : 'seasons._id',
                    foreignField: 'season_id',
                    as : 'episodes'
                }
            },
            {
                $project : {
                    episodes : {
                        $filter : {
                            input : '$episodes',
                            as : 'episode',
                            cond : { $eq : [ '$$episode.is_deleted', false ] }
                        }
                    }
                }
            },
            {
                $unwind : '$episodes'
            },
            {
                $group: {
                    _id: '$_id',
                    episodes: {
                        $push: {
                            _id: '$episodes._id',
                            name: '$episodes.name',
                            description: '$episodes.description',
                        }
                    }
                }
            },
            {
                $project : {
                    _id : 0
                }
            }
        ]);
        getResponseSuccess({res, data : data?.[0] || { episodes : [] } , message : 'all seasons fetch successfully by series id'})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const updateSeries =async(req, res)=>{
    try {
        const id = req.params.id;
        const isSeriesExist = await seriesModel.findOne({_id : id });
        if(!isSeriesExist) {
            return errorResponse({res, message : 'series does not exist!'})
        }
        const data = await seriesModel.findByIdAndUpdate(id, req.body);
        updateResponseSuccess({res, data, message: 'series updated successfully'});
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteSeries =async(req, res)=>{
    try {
        const id = req.params.id;
        await seriesModel.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'series deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createSeries, getSeries, updateSeries, deleteSeries, getAllSeries, getAllSeasonsBySeriesId, getAllEpisodesBySeriesId };