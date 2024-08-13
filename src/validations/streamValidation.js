import Joi from "joi";

export default {

    id : {
        paramsSchema : Joi.object().keys({
            id : Joi.string().required(),
        }),
    },

    register : {
        bodySchema : Joi.object().keys({
            episode_id : Joi.string().required(),
            user_id : Joi.string().required(),
            time : Joi.string().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            episode_id : Joi.string(),
            user_id : Joi.string(),
            time : Joi.string(),
        })
    }
};