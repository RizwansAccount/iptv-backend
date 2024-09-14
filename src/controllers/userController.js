import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../constants/responses.js";
import userModel from '../models/userModel.js';
import streamModel from '../models/streamModel.js';
import codeServiceModel from '../models/codeServiceModel.js';
import passwordHash from "password-hash";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { getMailOptions, getRandomCode, transporterEmail } from "../constants/code-verification.js";

const MessageService = transporterEmail();

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
        let { password, email } = req?.body;
        password = passwordHash?.generate(password);

        const isUserExist = await userModel.findOne({email});
        if(!isUserExist) {
            const verification_code = getRandomCode();

            await codeServiceModel.create({...req?.body, password, verification_code});
    
            const mailOptions = getMailOptions(email, verification_code);
    
            MessageService.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return res.status(500).json({ message: 'Error sending verification email' });
                }
                res.json({ success : true, message: 'Please check your email for the verification code' });
            });
        } else {
            errorResponse({res, message : 'user already exists!'})
        }


    } catch ({message}) {
        errorResponse({res, message});
    }
};

const resendCode =async(req, res)=>{
    try {
        const { email } = req.body;    
        const verification_code = getRandomCode();
    
        await codeServiceModel.updateOne({email}, { verification_code });
        
        const mailOptions = getMailOptions(email, verification_code);
    
        MessageService.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending verification email' });
            }
            res.json({ success : true, message: 'Please check your email for the verification code' });
        });
    } catch ({message}) {
        errorResponse({res, message})
    }
}

const verifyUserAccount =async(req, res)=>{
    try {
        const { email, verification_code } = req.body;
        const userData = await codeServiceModel.findOne({email, verification_code});

        if (userData?.verification_code != verification_code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        };
        const body = { first_name : userData?.first_name, last_name : userData?.last_name, email : userData?.email, password : userData?.password };
        const data = await userModel.create(body);

        await codeServiceModel.deleteOne({email, verification_code});
        postResponseSuccess({res, data, message : 'Account created successfully!'})

    } catch ({message}) {
        errorResponse({res, message})
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

        if(!data) {
            errorResponse({res, message : 'user does not exist'})
        }

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
            }
        ]);

        getResponseSuccess({res, data : data?.[0] || { streams : [] }, message : 'user all streams fetch successfully!'});
    
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

export { createUser, verifyUserAccount, resendCode, getUser, updateUser, deleteUser, loginUser, getAllUsers, getUserAllStreams,
    getUserStreamByStreamId, deleteUserStreamById
 };