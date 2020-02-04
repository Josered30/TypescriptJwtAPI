import { Router } from 'express';
import { validateToken } from '../libs/validateToken';
const router = Router();

import { signUp, signIn, profile, refresh } from '../controllers/authController';

router.route('/signup')
    .post(signUp);

router.route('/signin')
    .post(signIn);

router.route('/profile')
    .get(validateToken, profile);

router.route('/refresh')
    .post(refresh);


export default router;