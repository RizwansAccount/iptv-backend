import express from 'express';
import validate from '../middlewares/validation.js';
import { getSeason, createSeason, updateSeason, deleteSeason, getAllSeasons, getAllEpisodesBySeasonId } from '../controllers/seasonController.js';
import seasonValidation from '../validations/seasonValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, validate(seasonValidation.register.bodySchema), createSeason);

router.get('/', authenticate, getAllSeasons);
router.get('/:id', authenticate, validate(seasonValidation.id.paramsSchema, 'params'), getSeason);
router.get('/:id/episodes', authenticate, validate(seasonValidation.id.paramsSchema, 'params'), getAllEpisodesBySeasonId);

router.patch('/:id', authenticate, validate(seasonValidation.id.paramsSchema, 'params'), validate(seasonValidation.update.bodySchema), updateSeason);
router.delete('/:id', authenticate, validate(seasonValidation.id.paramsSchema, 'params'), deleteSeason);

export default router;