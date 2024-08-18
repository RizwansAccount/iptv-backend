import express from 'express';
import validate from '../middlewares/validation.js';
import { getEpisode, createEpisode, updateEpisode, deleteEpisode, getAllEpisodes, getAllStreamsByEpisodeId } from '../controllers/episodeController.js';
import episodeValidation from '../validations/episodeValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, validate(episodeValidation.register.bodySchema), createEpisode);

router.get('/', authenticate, getAllEpisodes);
router.get('/:id', authenticate, validate(episodeValidation.id.paramsSchema, 'params'), getEpisode);
router.get('/:id/streams', authenticate, getAllStreamsByEpisodeId);

router.patch('/:id', authenticate, validate(episodeValidation.id.paramsSchema, 'params'), validate(episodeValidation.update.bodySchema), updateEpisode);
router.delete('/:id', authenticate, validate(episodeValidation.id.paramsSchema, 'params'), deleteEpisode);

export default router;