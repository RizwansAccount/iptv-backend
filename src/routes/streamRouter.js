import express from 'express';
import validate from '../middlewares/validation.js';
import { getStream, createStream, updateStream, deleteStream, getAllStreams, getUserByStreamId,
    getEpisodeByStreamId, getSeasonOfEpisodeByStreamId, getSeriesOfSeasonEpisodeByStreamId, 
    getGenresOfSeriesOfSeasonEpisodeByStreamId
 } from '../controllers/streamController.js';
import streamValidation from '../validations/streamValidation.js';

const router = express.Router();
const paramsIdValidate = validate(streamValidation.id.paramsSchema, 'params');

router.post('/', validate(streamValidation.register.bodySchema), createStream);

router.get('/', getAllStreams);
router.get('/:id', paramsIdValidate, getStream);

router.get('/:id/user', paramsIdValidate, getUserByStreamId);
router.get('/:id/episode', paramsIdValidate, getEpisodeByStreamId);
router.get('/:id/episode/season', paramsIdValidate, getSeasonOfEpisodeByStreamId);
router.get('/:id/episode/season/series', paramsIdValidate, getSeriesOfSeasonEpisodeByStreamId);
router.get('/:id/episode/season/series/genre', paramsIdValidate, getGenresOfSeriesOfSeasonEpisodeByStreamId);


router.patch('/:id', paramsIdValidate, validate(streamValidation.update.bodySchema), updateStream);
router.delete('/:id', paramsIdValidate, deleteStream);

export default router;