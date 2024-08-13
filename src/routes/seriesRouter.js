import express from 'express';
import validate from '../middlewares/validation.js';
import { getSeries, createSeries, updateSeries, deleteSeries } from '../controllers/seriesController.js';
import seriesValidation from '../validations/seriesValidation.js';

const router = express.Router();

router.post('/', validate(seriesValidation.register.bodySchema), createSeries);

router.get('/:id', validate(seriesValidation.id.paramsSchema, 'params'), getSeries);
router.patch('/:id', validate(seriesValidation.id.paramsSchema, 'params'), validate(seriesValidation.update.bodySchema), updateSeries);
router.delete('/:id', validate(seriesValidation.id.paramsSchema, 'params'), deleteSeries);

export default router;