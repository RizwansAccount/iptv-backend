import Joi from "joi";

export default {

    id : {
        paramsSchema : Joi.object().keys({
            id : Joi.string().required(),
        }),
    },

    register : {
        bodySchema : Joi.object().keys({
            genre_id : Joi.string().required(),
            series_id : Joi.string().required(),
        })
    },

    update : {
        bodySchema : Joi.object().keys({
            genre_id : Joi.string(),
            series_id : Joi.string(),
        })
    }
};