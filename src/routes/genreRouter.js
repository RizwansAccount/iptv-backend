import express from 'express';
import validate from '../middlewares/validation.js';
import { getGenre, createGenre, updateGenre, deleteGenre, getAllGenre, getAllSeriesByGenreId, getAllSeasonsByGenreId } from '../controllers/genreController.js';
import genreValidation from '../validations/genreValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, validate(genreValidation.register.bodySchema), createGenre);

router.get('/', authenticate, getAllGenre);
router.get('/:id', authenticate, validate(genreValidation.id.paramsSchema, 'params'), getGenre);
router.get('/:id/series', authenticate, validate(genreValidation.id.paramsSchema , 'params'), getAllSeriesByGenreId);
router.get('/:id/series/seasons', authenticate, validate(genreValidation.id.paramsSchema , 'params'), getAllSeasonsByGenreId);

router.patch('/:id', authenticate, validate(genreValidation.id.paramsSchema, 'params'), validate(genreValidation.update.bodySchema), updateGenre);

router.delete('/:id', authenticate, validate(genreValidation.id.paramsSchema, 'params'), deleteGenre);

export default router;