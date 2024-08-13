import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import seriesModel from '../models/seriesModel.js';

const createSeries =async(req, res)=>{
    try {
        const data = await seriesModel.create(req.body);
        const { _id, name, description, tailer_id, thumbnail_id } = data;
        postResponseSuccess({res, data : { _id, name, description, tailer_id, thumbnail_id}, message : 'series created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
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

const updateSeries =async(req, res)=>{
    try {
        const id = req.params.id;
        const isSeriesExist = await seriesModel.findOne({_id : id, is_deleted : false});
        if(!isSeriesExist) {
            return errorResponse({res, message : 'series does not exist!'})
        }
        const data = await seriesModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v');
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

export { createSeries, getSeries, updateSeries, deleteSeries  };