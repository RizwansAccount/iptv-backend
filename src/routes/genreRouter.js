import express from 'express';
import validate from '../middlewares/validation.js';
import { getGenre, createGenre, updateGenre, deleteGenre } from '../controllers/genreController.js';
import genreValidation from '../validations/genreValidation.js';

const router = express.Router();

router.post('/', validate(genreValidation.register.bodySchema), createGenre);

router.get('/:id', validate(genreValidation.id.paramsSchema, 'params'), getGenre);
router.patch('/:id', validate(genreValidation.id.paramsSchema, 'params'), validate(genreValidation.update.bodySchema), updateGenre);
router.delete('/:id', validate(genreValidation.id.paramsSchema, 'params'), deleteGenre);

export default router;