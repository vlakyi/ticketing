import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Validation
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@vlakyi-org/common';

// Models
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT

    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);   // existance of this variable was handled inside index.ts file

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  });

export { router as signupRouter };