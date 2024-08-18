import express from 'express';
import validate from '../middlewares/validation.js';
import { getStream, createStream, updateStream, deleteStream, getAllStreams, getUserByStreamId,
    getEpisodeByStreamId, getSeasonOfEpisodeByStreamId, getSeriesOfSeasonEpisodeByStreamId, 
    getGenresOfSeriesOfSeasonEpisodeByStreamId
 } from '../controllers/streamController.js';
import streamValidation from '../validations/streamValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();
const paramsIdValidate = validate(streamValidation.id.paramsSchema, 'params');

router.post('/', authenticate, validate(streamValidation.register.bodySchema), createStream);

router.get('/', authenticate, getAllStreams);
router.get('/:id', authenticate, paramsIdValidate, getStream);

router.get('/:id/user', authenticate, paramsIdValidate, getUserByStreamId);
router.get('/:id/episode', authenticate, paramsIdValidate, getEpisodeByStreamId);
router.get('/:id/episode/season', authenticate, paramsIdValidate, getSeasonOfEpisodeByStreamId);
router.get('/:id/episode/season/series', authenticate, paramsIdValidate, getSeriesOfSeasonEpisodeByStreamId);
router.get('/:id/episode/season/series/genre', authenticate, paramsIdValidate, getGenresOfSeriesOfSeasonEpisodeByStreamId);


router.patch('/:id', authenticate, paramsIdValidate, validate(streamValidation.update.bodySchema), updateStream);
router.delete('/:id', authenticate, paramsIdValidate, deleteStream);

export default router;