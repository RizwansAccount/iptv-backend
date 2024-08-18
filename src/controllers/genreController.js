import mongoose from "mongoose";
import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import genreModel from '../models/genreModel.js';
import genreSeriesModel from '../models/genreSeriesModel.js';

const createGenre =async(req, res)=>{
    try {
        const data = await genreModel.create(req.body);
        const { _id, name } = data;
        postResponseSuccess({res, data : { _id, name}, message : 'genre created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllGenre =async(req, res)=>{
    try {
        const data = await genreModel.find({ is_deleted : false }, { is_deleted : 0, __v : 0 });
        getResponseSuccess({res, data, message : 'all genre fetch successfully!'});
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getGenre =async(req, res)=>{
    try {
        const id = req.params.id;

        const data = await genreModel.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});

        if(!data) {
            return errorResponse({res, message : 'genre does not exist!'})
        }

        getResponseSuccess({res, data, message : 'genre fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllSeriesByGenreId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await genreSeriesModel.aggregate([
            {
                $match: { genre_id: new mongoose.Types.ObjectId(id), is_deleted: false }
            },
            {
                $lookup: {
                    from: 'series',
                    localField: 'series_id',
                    foreignField: '_id',
                    as: 'series',
                }
            },
            {
                $project : {
                    series : {
                        $filter : {
                            input : '$series',
                            as : 'series',
                            cond : { $eq : [ '$$series.is_deleted', false ] }
                        }
                    }
                }
            },
            {
                $unwind: '$series'
            },
            {
                $group: {
                    _id: null,
                    series: {
                        $push: {
                            _id: '$series._id',
                            name: '$series.name',
                            description: '$series.description',
                            thumbnail_id: '$series.thumbnail_id',
                            trailer_id: '$series.trailer_id'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    series: 1
                }
            }
        ]);
        
        getResponseSuccess({res, data: data?.[0], message: 'All series of genre fetched successfully!'})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getAllSeasonsByGenreId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await genreSeriesModel.aggregate([
            {
                $match: { genre_id: new mongoose.Types.ObjectId(id), is_deleted: false }
            },
            {
                $lookup: {
                    from: 'series',
                    localField: 'series_id',
                    foreignField: '_id',
                    as: 'series'
                }
            },
            {
                $unwind: '$series'
            },
            {
                $match: { 'series.is_deleted': false }
            },
            {
                $lookup: {
                    from: 'seasons',
                    localField: 'series._id',
                    foreignField: 'series_id',
                    as: 'seasons'
                }
            },
            {
                $unwind: '$seasons'
            },
            {
                $match: { 'seasons.is_deleted': false }
            },
            {
                $group: {
                    _id: null,
                    seasons: { $push: '$seasons' }
                }
            },
            {
                $project: {
                    seasons: {
                        $map : {
                            input : '$seasons',
                            as : 'season',
                            in : {
                                '_id' : '$$season._id',
                                'name' : '$$season.name',
                                'description' : '$$season.description',
                            }
                        }
                    }
                }
            }
        ]);
                
        getResponseSuccess({res, data: data?.[0]?.seasons || { seasons : [] }, message: 'All seasons of genre fetched successfully!'})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const updateGenre =async(req, res)=>{
    try {
        const id = req.params.id;
        const isGenreExist = await genreModel.findOne({_id : id, is_deleted : false});

        if(!isGenreExist) {
            return errorResponse({res, message : 'genre does not exist!'})
        }
        
        const data = await genreModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v');
        updateResponseSuccess({res, data, message: 'genre updated successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteGenre =async(req, res)=>{
    try {
        const id = req.params.id;
        await genreModel.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'genre deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createGenre, getGenre, updateGenre, deleteGenre, getAllGenre, getAllSeriesByGenreId, getAllSeasonsByGenreId };