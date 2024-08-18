import express from 'express';
import validate from '../middlewares/validation.js';
import { getFile, createFile, deleteFile, updateFile } from '../controllers/fileController.js';
import fileValidation from '../validations/fileValidation.js';
import uploadFile from '../config/uploadFile.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, uploadFile.single("file"), createFile);

router.patch('/:id', authenticate, validate(fileValidation.id.paramsSchema, 'params'), uploadFile.single("file"), updateFile);

router.get('/:id', authenticate, validate(fileValidation.id.paramsSchema, 'params'), getFile);
router.delete('/:id', authenticate, validate(fileValidation.id.paramsSchema, 'params'), deleteFile);

export default router;