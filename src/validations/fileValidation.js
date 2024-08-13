import Joi from "joi";

export default {

    id : {
        paramsSchema : Joi.object().keys({
            id : Joi.string().required(),
        }),
    },

    register : {
        bodySchema : Joi.object().keys({
            original_name : Joi.string().required(),
            current_name : Joi.string().required(),
            // type : Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
            type : Joi.string().required(),
            path : Joi.string().uri().required(),
            size : Joi.number().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            original_name : Joi.string(),
            current_name : Joi.string(),
            type : Joi.string(),
            path : Joi.string(),
            size : Joi.string(),
        })
    }
};