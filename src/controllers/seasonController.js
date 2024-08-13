import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import seasonModel from '../models/seasonModel.js';

const createSeason =async(req, res)=>{
    try {
        const data = await seasonModel.create(req.body);
        const { _id, name, series_id, description } = data;
        postResponseSuccess({ res, data : {_id, name, series_id, description}, message : 'season created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
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

export { createSeason, getSeason, updateSeason, deleteSeason  };