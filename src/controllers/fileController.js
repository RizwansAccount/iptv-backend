import { deleteResponseSuccess, errorResponse, getResponseSuccess, updateResponseSuccess } from "../constants/responses.js";
import fileModal from '../models/fileModel.js';

const createFile =async(req, res)=>{
    try {
        if (!req.file) { return res.status(400).send("File does not exist."); }
        const file = req?.file;
        const body = {
            original_name : file?.originalname,
            current_name : file?.filename,
            type : file?.mimetype,
            path : file?.path,
            size : file?.size,
        };
        await fileModal.create(body);
        res.json({success : true, message : 'File upload successfully!'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const getFile =async(req, res)=>{
    try {
        const id = req.params.id;

        const data = await fileModal.findOne({ _id : id, is_deleted : false }, {is_deleted : 0, __v : 0});

        if(!data) {
            return errorResponse({res, message : 'file does not exist!'})
        }

        getResponseSuccess({res, data, message : 'file fetch successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const updateFile =async(req, res)=>{
    try {
        const id = req.params.id;
        if (!req.file) { return res.status(400).send("File does not exist."); }
        const file = req?.file;
        const body = {
            original_name : file?.originalname,
            current_name : file?.filename,
            type : file?.mimetype,
            path : file?.path,
            size : file?.size,
        };

        await fileModal.findByIdAndUpdate(id, body);
        res.json({ success : true, message : 'File updated successfully!' });

    } catch ({message}) {
        errorResponse({res, message});
    }
};

const deleteFile =async(req, res)=>{
    try {
        const id = req.params.id;
        await fileModal.findByIdAndUpdate(id, { is_deleted : true });
        deleteResponseSuccess({res, message: 'file deleted successfully'});

    } catch ({message}) {
        errorResponse({res, message});
    }
};

export { createFile, getFile, deleteFile, updateFile };