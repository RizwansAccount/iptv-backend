import Joi from "joi";

export default {

    id : {
        paramsSchema : Joi.object().keys({
            id : Joi.string().required(),
        }),
    },

    register : {
        bodySchema : Joi.object().keys({
            name : Joi.string().alphanum().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            name : Joi.string().alphanum(),
        })
    }
};