import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

import User from '../models/user';
import Photo from '../models/photo';
import createError from '../utils/createError';

export const createUser = asyncHandler(
  async (req, res, next): Promise<void> => {
    const photo = await Photo.findById(req.query.photoid).exec();
    if (photo === null) {
      const err = createError(404, 'Photo not found');
      return next(err);
    }

    const user = new User({
      isAnonymous: true,
      startTime: new Date(),
      photo: photo._id,
    });

    await user.save();
    res.json(user);
  },
);

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();
  if (user === null) {
    const err = createError(404, 'User not found');
    return next(err);
  }

  res.json(user);
});

export const getUserTime = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();
  if (user === null) {
    const err = createError(404, 'User not found');
    return next(err);
  }

  res.json({ time: user.getCurrentTime() });
});

export const saveToLeaderboard = [
  body('name')
    .isLength({ min: 1, max: 32 })
    .withMessage('Name should be between 1-32 characters.')
    .isAlphanumeric()
    .withMessage('Name should not contain any special characters.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = await User.findById(req.params.userid).exec();
    if (user === null) {
      const err = createError(404, 'User not found');
      return next(err);
    }

    if (!user.isAnonymous) {
      const err = createError(
        400,
        'This user is already registered to the leaderboard!',
      );
      return next(err);
    }

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userid, {
      isAnonymous: false,
      name: req.body.name,
    }).exec();

    res.json({ message: 'Saved to leaderboard!' });
  }),
];

export const recordTime = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();
  if (user === null) {
    const err = createError(404, 'User not found');
    return next(err);
  }

  const time = user.getCurrentTime();
  await User.findByIdAndUpdate(req.params.userid, { time }).exec();

  res.json({ message: 'Time saved to leaderboard', time });
});
