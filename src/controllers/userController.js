import { deleteResponseSuccess, errorResponse, getResponseSuccess, postResponseSuccess, updateResponseSuccess } from "../config/responses.js";
import userModel from '../models/userModel.js';
import passwordHash from "password-hash";
import jwt from 'jsonwebtoken';

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

export { createUser, getUser, updateUser, deleteUser, loginUser  };