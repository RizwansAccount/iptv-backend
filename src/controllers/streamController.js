import mongoose from "mongoose";
import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../constants/responses.js";
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

const getAllStreams =async(req, res)=>{
    try {
        const data = await streamModel.find({is_deleted : false}, { is_deleted : 0, __v: 0 });
        getResponseSuccess({res, data, message : 'fetch all streams successfully!'})
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

const getUserByStreamId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await streamModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'user_id',
                    foreignField: '_id',
                    as : 'user'
                }
            },
            {
                $unwind : '$user'
            },
            {
                $project : {
                    user: {
                        _id: '$user._id',
                        first_name: '$user.first_name',
                        last_name: '$user.last_name',
                        email: '$user.email',
                    },
                    '_id' : 0,
                }
            },
        ]);
        getResponseSuccess({res, data : data?.[0], message : 'user data fetch successfully!'})
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getEpisodeByStreamId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await streamModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'episodes',
                    localField: 'episode_id',
                    foreignField : '_id',
                    as : 'episode',
                }
            },
            {
                $unwind : '$episode'
            },
            {
                $match : {'episode.is_deleted' : false}
            },
            {
                $project : {
                    episode : {
                        _id : '$episode._id',
                        name : '$episode.name',
                        description : '$episode.description',
                        season_id : '$episode.season_id',
                        thumbnail_id : '$episode.thumbnail_id',
                    },
                    _id : 0
                }
            }
        ]);
        getResponseSuccess({res, data : data?.[0] ?? { episode : {} }, message :'episode of this stream fetch successfully!'})
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getSeasonOfEpisodeByStreamId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await streamModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'episodes',
                    localField: 'episode_id',
                    foreignField : '_id',
                    as : 'episode',
                    pipeline: [
                        {
                            $match : { 'is_deleted' : false }
                        },
                        {
                            $lookup : {
                                from : 'seasons',
                                localField : 'season_id',
                                foreignField : '_id',
                                as : 'season'
                            }
                        },
                        {
                            $unwind : '$season'
                        },
                        {
                            $project : {
                                'is_deleted' : 0,
                                '__v' : 0,
                                'season.is_deleted' : 0,
                                'season.__v' : 0,
                            }
                        }
                    ]
                }
            },
            {
                $unwind : '$episode'
            },
            {
                $project : {
                    season : '$episode.season',
                    _id : 0
                }
            }

        ]);
        getResponseSuccess({res, data : data?.[0], message : 'get season by stream id successfully!'})
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getSeriesOfSeasonEpisodeByStreamId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await streamModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'episodes',
                    localField : 'episode_id',
                    foreignField : '_id',
                    pipeline : [
                       {
                            $match : { 'is_deleted' : false }
                       },
                       {
                            $lookup : {
                                from : 'seasons',
                                localField : 'season_id',
                                foreignField : '_id',
                                pipeline : [
                                    {
                                        $match : { 'is_deleted' : false }
                                    },
                                    {
                                        $lookup : {
                                            from : 'series',
                                            localField : 'series_id',
                                            foreignField : '_id',
                                            as : 'series'
                                        }
                                    },
                                ],
                                as : 'season',
                            }
                       },
                       {
                        $unwind : '$season'
                       }
                    ],
                    as : 'episode',
                },
            },
            {
                $unwind : '$episode'
            },
            {
                $project : {
                    series : '$episode.season.series',
                    _id : 0
                }
            }
        ]);
        getResponseSuccess({res, data : data?.[0] || { series : [] }, message : 'get season by stream id successfully!'})
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getGenresOfSeriesOfSeasonEpisodeByStreamId =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await streamModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'episodes',
                    localField : 'episode_id',
                    foreignField : '_id',
                    pipeline : [
                       {
                            $match : { 'is_deleted' : false }
                       },
                       {
                            $lookup : {
                                from : 'seasons',
                                localField : 'season_id',
                                foreignField : '_id',
                                pipeline : [
                                    {
                                        $match : { 'is_deleted' : false }
                                    },
                                    {
                                        $lookup : {
                                            from : 'series',
                                            localField : 'series_id',
                                            foreignField : '_id',
                                            pipeline : [
                                                {
                                                    $match : {'is_deleted' : false}
                                                },
                                                {
                                                    $lookup : {
                                                        from : 'genreseries',
                                                        localField : '_id',
                                                        foreignField: 'series_id',
                                                        pipeline: [
                                                            {
                                                                $match : { 'is_deleted' : false }
                                                            },
                                                            {
                                                                $lookup : {
                                                                    from : 'genres',
                                                                    localField: 'genre_id',
                                                                    foreignField : '_id',
                                                                    as : 'genres'
                                                                }
                                                            },
                                                            {
                                                                $unwind : '$genres'
                                                            }
                                                        ],
                                                        as : 'genre-series',
                                                    }
                                                }
                                            ],
                                            as : 'series',
                                        }
                                    },
                                ],
                                as : 'season',
                            }
                       },
                       {
                        $unwind : '$season'
                       }
                    ],
                    as : 'episode',
                },
            },
            {
                $unwind : '$episode'
            },
            {
                $project : { 
                    series : '$episode.season.series'
                }
            },
            {
                $unwind : '$series'
            },
            {
                $unwind : '$series.genre-series'
            },
            {
                $project: {
                    genres: '$series.genre-series.genres',
                }
            },
            {
                $group : {
                    _id : null,
                    genres : {
                        $push : {
                            _id : '$genres._id',
                            name : '$genres.name',
                        }
                    }
                }
            },
            {
                $project : {
                    genres : 1,
                    _id : 0
                }
            }
        ]);
        getResponseSuccess({res, data : data?.[0] || { genres : [] }, message : 'get genres by stream id successfully!'})
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

export { createStream, getStream, updateStream, deleteStream, getAllStreams, getUserByStreamId, getEpisodeByStreamId,
    getSeasonOfEpisodeByStreamId, getSeriesOfSeasonEpisodeByStreamId, getGenresOfSeriesOfSeasonEpisodeByStreamId
 };