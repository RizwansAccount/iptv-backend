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
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            name : Joi.string(),
            is_deleted: Joi.boolean()
        })
    }
};