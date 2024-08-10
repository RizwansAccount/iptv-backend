import express from 'express';
import validate from '../middlewares/validation.js';
import userValidation from '../validations/userValidation.js';
import { getUser, createUser, updateUser, deleteUser, loginUser } from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/signup', validate(userValidation.register.bodySchema) ,createUser);
router.post('/login', validate(userValidation.login.bodySchema), loginUser);

router.get('/:id', authenticate, validate(userValidation.id.paramsSchema, 'params'), getUser);
router.patch('/:id', authenticate, validate(userValidation.id.paramsSchema, 'params'), validate(userValidation.update.bodySchema), updateUser);
router.delete('/:id', authenticate, validate(userValidation.id.paramsSchema, 'params'), deleteUser);

export default router;