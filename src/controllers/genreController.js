import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import genreModel from '../models/genreModel.js';

const createGenre =async(req, res)=>{
    try {
        const data = await genreModel.create(req.body);
        const { _id, name } = data;
        postResponseSuccess({res, data : { _id, name}, message : 'genre created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
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

export { createGenre, getGenre, updateGenre, deleteGenre  };