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
            description: Joi.string().required(),
            tailer_id : Joi.string().required(),
            thumbnail_id : Joi.string().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            name : Joi.string(),
            description: Joi.string(),
            tailer_id : Joi.string(),
            thumbnail_id : Joi.string(),
            is_deleted: Joi.boolean()
        })
    }
};