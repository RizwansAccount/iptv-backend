import express from 'express';
import validate from '../middlewares/validation.js';
import { getSeries, createSeries, updateSeries, deleteSeries, getAllSeries, getAllSeasonsBySeriesId, getAllEpisodesBySeriesId } from '../controllers/seriesController.js';
import seriesValidation from '../validations/seriesValidation.js';

const router = express.Router();

router.post('/', validate(seriesValidation.register.bodySchema), createSeries);

router.get('/', getAllSeries);
router.get('/:id', validate(seriesValidation.id.paramsSchema, 'params'), getSeries);
router.get('/:id/seasons', getAllSeasonsBySeriesId);
router.get('/:id/seasons/episodes', getAllEpisodesBySeriesId);

router.patch('/:id', validate(seriesValidation.id.paramsSchema, 'params'), validate(seriesValidation.update.bodySchema), updateSeries);
router.delete('/:id', validate(seriesValidation.id.paramsSchema, 'params'), deleteSeries);

export default router;