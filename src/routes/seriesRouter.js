import express from 'express';
import validate from '../middlewares/validation.js';
import { getSeries, createSeries, updateSeries, deleteSeries, getAllSeries, getAllSeasonsBySeriesId, getAllEpisodesBySeriesId } from '../controllers/seriesController.js';
import seriesValidation from '../validations/seriesValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, validate(seriesValidation.register.bodySchema), createSeries);

router.get('/', authenticate, getAllSeries);
router.get('/:id', authenticate, validate(seriesValidation.id.paramsSchema, 'params'), getSeries);
router.get('/:id/seasons', authenticate, validate(seriesValidation.id.paramsSchema, 'params'), getAllSeasonsBySeriesId);
router.get('/:id/seasons/episodes', authenticate, validate(seriesValidation.id.paramsSchema, 'params'), getAllEpisodesBySeriesId);

router.patch('/:id', authenticate, validate(seriesValidation.id.paramsSchema, 'params'), validate(seriesValidation.update.bodySchema), updateSeries);
router.delete('/:id', authenticate, validate(seriesValidation.id.paramsSchema, 'params'), deleteSeries);

export default router;