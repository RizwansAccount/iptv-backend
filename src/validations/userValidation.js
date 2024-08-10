import Joi from "joi";

export default {

    id : {
        paramsSchema : Joi.object().keys({
            id : Joi.string().required(),
        }),
    },

    register : {
        bodySchema : Joi.object().keys({
            first_name : Joi.string().required(),
            last_name : Joi.string().required(),
            email : Joi.string().required().email(),
            password : Joi.string().required(),
        })
    },

    login : {
        bodySchema : Joi.object().keys({
            email : Joi.string().required().email(),
            password : Joi.string().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            first_name : Joi.string(),
            last_name : Joi.string(),
            email : Joi.string().email(),
            password : Joi.string(),
        })
    }
};