import express from 'express';
import validate from '../middlewares/validation.js';
import userValidation from '../validations/userValidation.js';
import { getUser, createUser, verifyUserAccount, resendCode, updateUser, deleteUser, loginUser, getAllUsers, getUserAllStreams,
    getUserStreamByStreamId, deleteUserStreamById
 } from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/registration', validate(userValidation.register.bodySchema) ,createUser);
router.post('/verify-code', validate(userValidation.verifyCode.bodySchema), verifyUserAccount);
router.post('/resend-code', validate(userValidation.email.bodySchema), resendCode);
router.post('/login', validate(userValidation.login.bodySchema), loginUser);

router.get('/', authenticate, getAllUsers);
router.get('/:id/streams', authenticate, validate(userValidation.id.paramsSchema, 'params'), getUserAllStreams);
router.get('/:id/streams/:streamId', authenticate, validate(userValidation.idAndStreamId.paramsSchema, 'params'), getUserStreamByStreamId);
router.get('/:id', authenticate, validate(userValidation.id.paramsSchema, 'params'), getUser);

router.patch('/:id', authenticate, validate(userValidation.id.paramsSchema, 'params'), validate(userValidation.update.bodySchema), updateUser);

router.delete('/:id/streams/:streamId', authenticate, validate(userValidation.idAndStreamId.paramsSchema, 'params'), deleteUserStreamById);
router.delete('/:id', authenticate, validate(userValidation.id.paramsSchema, 'params'), deleteUser);

export default router;