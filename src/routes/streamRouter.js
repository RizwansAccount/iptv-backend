import express from 'express';
import validate from '../middlewares/validation.js';
import { getStream, createStream, updateStream, deleteStream } from '../controllers/streamController.js';
import streamValidation from '../validations/streamValidation.js';

const router = express.Router();

router.post('/', validate(streamValidation.register.bodySchema), createStream);

router.get('/:id', validate(streamValidation.id.paramsSchema, 'params'), getStream);
router.patch('/:id', validate(streamValidation.id.paramsSchema, 'params'), validate(streamValidation.update.bodySchema), updateStream);
router.delete('/:id', validate(streamValidation.id.paramsSchema, 'params'), deleteStream);

export default router;