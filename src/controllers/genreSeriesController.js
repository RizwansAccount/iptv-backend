import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../constants/responses.js";
import genreSeriesModel from '../models/genreSeriesModel.js';

const createGenreSeries =async(req, res)=>{
    try {
        await genreSeriesModel.create(req.body);
        res.json({success : true, message : 'genre-series created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getAllGenreSeries =async(req, res)=>{
    try {
        const data = await genreSeriesModel.find({ is_deleted : false }, { is_deleted : 0, __v : 0 });
        getResponseSuccess({res, data})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getGenreSeries =async(req, res)=>{
    try {
        const id = req.params.id;

        const data = await genreSeriesModel.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});

        if(!data) {
            return errorResponse({res, message : 'genre-series does not exist!'})
        }

        getResponseSuccess({res, data, message : 'genre-series fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const updateGenreSeries =async(req, res)=>{
    try {
        const id = req.params.id;
        const isGenreSeriesExist = await genreSeriesModel.findOne({_id : id, is_deleted : false});

        if(!isGenreSeriesExist) {
            return errorResponse({res, message : 'genre-series does not exist!'})
        }
        
        const data = await genreSeriesModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v');
        updateResponseSuccess({res, data, message: 'genre-series updated successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteGenreSeries =async(req, res)=>{
    try {
        const id = req.params.id;
        await genreSeriesModel.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'genre deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createGenreSeries, getGenreSeries, updateGenreSeries, deleteGenreSeries, getAllGenreSeries  };