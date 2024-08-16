import express from 'express';
import validate from '../middlewares/validation.js';
import { getEpisode, createEpisode, updateEpisode, deleteEpisode, getAllEpisodes, getAllStreamsByEpisodeId } from '../controllers/episodeController.js';
import episodeValidation from '../validations/episodeValidation.js';

const router = express.Router();

router.post('/', validate(episodeValidation.register.bodySchema), createEpisode);

router.get('/', getAllEpisodes);
router.get('/:id', validate(episodeValidation.id.paramsSchema, 'params'), getEpisode);
router.get('/:id/streams', getAllStreamsByEpisodeId);

router.patch('/:id', validate(episodeValidation.id.paramsSchema, 'params'), validate(episodeValidation.update.bodySchema), updateEpisode);
router.delete('/:id', validate(episodeValidation.id.paramsSchema, 'params'), deleteEpisode);

export default router;