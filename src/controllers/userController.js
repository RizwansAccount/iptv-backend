import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import userModel from '../models/userModel.js';
import streamModel from '../models/streamModel.js';
import passwordHash from "password-hash";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const getAllUsers = async(req, res)=>{
    try {
        const data = await userModel.find({}, {is_deleted : 0, __v : 0, password : 0});
        getResponseSuccess({res, data, message : 'all users fetch successfully!'})
    } catch ({message}) {
        errorResponse({res, message});
    }
};

const createUser =async(req, res)=>{
    try {
        let { password } = req.body;

        password = passwordHash.generate(password);

        const body = {...req.body, password};

        const data = await userModel.create(body);

        const { _id, first_name, last_name, email } = data;

        postResponseSuccess({res, data : { _id, first_name, last_name, email}, message : 'user created successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const loginUser =async(req, res)=>{
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({email});

        if(!user) { return errorResponse({res, message : "user not exists!"}) };

        const isPasswordValid = passwordHash?.verify(password, user?.password);

        if(!isPasswordValid) { return errorResponse({res, message : "invalid password!"}) };

        const token = jwt.sign({ id : user?._id, email : user?.email }, process.env.TOKEN_USER_SECRET);

        res.json({success : true, token, message : 'user logged in successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getUser =async(req, res)=>{
    try {
        const id = req.params.id;

        const data = await userModel.findOne({ _id : id }, {is_deleted : 0, password : 0, __v : 0});

        getResponseSuccess({res, data, message : 'user fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getUserAllStreams =async(req, res)=>{
    try {
        const id = req.params.id;
        const data = await userModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(id), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'streams',
                    localField : '_id',
                    foreignField : 'user_id',
                    as : 'streams' 
                }
            },
            {
                $project : {
                    streams : {
                        $filter : {
                            input : '$streams',
                            as : 'stream',
                            cond : { $eq : ['$$stream.is_deleted', false] }
                        }
                    },
                    _id : 0
                }
            },
            {
                $project : {
                   streams : {
                    $map : {
                        input : '$streams',
                        as : 'stream',
                        in : {
                            '_id' : '$$stream._id',
                            'episode_id' : '$$stream.episode_id',
                            'user_id' : '$$stream.user_id',
                            'time' : '$$stream.time'
                        }
                    }
                   }
                }
            }
        ]);

        getResponseSuccess({res, data : data?.[0]??[], message : 'user all streams fetch successfully!'});
    
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const getUserStreamByStreamId =async(req, res)=>{
    try {
        const userId = req.params.id;
        const streamId = req.params.streamId;
        const data = await userModel.aggregate([
            {
                $match : { _id : new mongoose.Types.ObjectId(userId), is_deleted : false }
            },
            {
                $lookup : {
                    from : 'streams',
                    localField: '_id',
                    foreignField : 'user_id',
                    as : 'streams'
                }
            },
            {
                $unwind: '$streams'
            },
            {
                $match: { 'streams._id': new mongoose.Types.ObjectId(streamId) }
            },
            {
                $match : { 'streams.is_deleted' : false }
            },
            {
                $project: {
                    stream: {
                        _id : '$streams._id',
                        episode_id: '$streams.episode_id',
                        user_id: '$streams.user_id',
                        time: '$streams.time',
                    },
                    '_id' :0,
                }
            }
        ]);
        getResponseSuccess({res, data : data?.[0] || { stream : {} }, message : 'get stream of a user fetch successfully!'})
    } catch ({message}) {
        errorResponse({res, message})
    }
};

const updateUser =async(req, res)=>{
    try {
        const id = req.params.id;

        const isUserExist = await userModel.findOne({_id : id, is_deleted : false});

        if(!isUserExist) { return errorResponse({res, message : 'user doest not exist'})};

        const data = await userModel.findByIdAndUpdate(id, req.body).select('-is_deleted -__v -password');

        updateResponseSuccess({res, data, message: 'user updated successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteUser =async(req, res)=>{
    try {
        const id = req.params.id;

        await userModel.findByIdAndUpdate(id, { is_deleted : true });

        deleteResponseSuccess({res, message: 'user deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteUserStreamById =async(req, res)=>{
    try {
        const userId = req.params.id;
        const streamId = req.params.streamId;

        const stream = await streamModel.findOne({ _id: streamId, user_id: userId });
        if (!stream) {
            return errorResponse({ res, message: 'Stream not found or does not belong to the user' });
        };
        await streamModel.findByIdAndUpdate(streamId, { is_deleted : true });
        deleteResponseSuccess({ res, message: 'Stream deleted successfully' });
    
    } catch ({message}) {
        errorResponse({res, message})
    }
};

export { createUser, getUser, updateUser, deleteUser, loginUser, getAllUsers, getUserAllStreams,
    getUserStreamByStreamId, deleteUserStreamById
 };