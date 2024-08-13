import express from 'express';
import validate from '../middlewares/validation.js';
import { getSeason, createSeason, updateSeason, deleteSeason } from '../controllers/seasonController.js';
import seasonValidation from '../validations/seasonValidation.js';

const router = express.Router();

router.post('/', validate(seasonValidation.register.bodySchema), createSeason);

router.get('/:id', validate(seasonValidation.id.paramsSchema, 'params'), getSeason);
router.patch('/:id', validate(seasonValidation.id.paramsSchema, 'params'), validate(seasonValidation.update.bodySchema), updateSeason);
router.delete('/:id', validate(seasonValidation.id.paramsSchema, 'params'), deleteSeason);

export default router;