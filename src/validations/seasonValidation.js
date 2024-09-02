import Joi from "joi";

export default {

    id : {
        paramsSchema : Joi.object().keys({
            id : Joi.string().required(),
        }),
    },

    register : {
        bodySchema : Joi.object().keys({
            name : Joi.string().required(),
            series_id : Joi.string().required(),
            description : Joi.string().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            name : Joi.string(),
            series_id : Joi.string(),
            description : Joi.string(),
            is_deleted : Joi.boolean()
        })
    }
};