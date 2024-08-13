import express from 'express';
import validate from '../middlewares/validation.js';
import { getGenreSeries, createGenreSeries, updateGenreSeries, deleteGenreSeries } from '../controllers/genreSeriesController.js';
import genreSeriesValidation from '../validations/genreSeriesValidation.js';

const router = express.Router();

router.post('/', validate(genreSeriesValidation.register.bodySchema), createGenreSeries);

router.get('/:id', validate(genreSeriesValidation.id.paramsSchema, 'params'), getGenreSeries);
router.patch('/:id', validate(genreSeriesValidation.id.paramsSchema, 'params'), validate(genreSeriesValidation.update.bodySchema), updateGenreSeries);
router.delete('/:id', validate(genreSeriesValidation.id.paramsSchema, 'params'), deleteGenreSeries);

export default router;