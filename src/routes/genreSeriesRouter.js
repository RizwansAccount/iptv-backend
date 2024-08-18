import express from 'express';
import validate from '../middlewares/validation.js';
import { getGenreSeries, createGenreSeries, updateGenreSeries, deleteGenreSeries } from '../controllers/genreSeriesController.js';
import genreSeriesValidation from '../validations/genreSeriesValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, validate(genreSeriesValidation.register.bodySchema), createGenreSeries);

router.get('/:id', authenticate, validate(genreSeriesValidation.id.paramsSchema, 'params'), getGenreSeries);
router.patch('/:id', authenticate, validate(genreSeriesValidation.id.paramsSchema, 'params'), validate(genreSeriesValidation.update.bodySchema), updateGenreSeries);
router.delete('/:id', authenticate, validate(genreSeriesValidation.id.paramsSchema, 'params'), deleteGenreSeries);

export default router;