import asyncHandler from 'express-async-handler';
import path from 'path';

import Photo from '../models/photo';
import User from '../models/user';
import createError from '../utils/createError';

export const getPhoto = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findOne({ name: req.params.photo_name }).exec();

  if (photo === null) {
    const err = createError(404, 'Photo not found');
    return next(err);
  }

  res.json(photo);
});

export const getPhotoMain = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findOne({
    name: req.params.photo_name,
  }).exec();

  if (photo === null) {
    const err = createError(404, 'Photo not found');
    return next(err);
  }

  res.sendFile(path.resolve(`static/images/${photo.name}/main.jpg`));
});

export const getPhotoPreview = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findOne({
    name: req.params.photo_name,
  }).exec();

  if (photo === null) {
    const err = createError(404, 'Photo not found');
    return next(err);
  }

  res.sendFile(path.resolve(`static/images/${photo.name}/preview.jpg`));
});

export const getPhotoTarget = asyncHandler(async (req, res, next) => {
  const { photo_name, target_name } = req.params;

  const photo = await Photo.findOne({ name: photo_name }).exec();

  if (photo === null) {
    const err = createError(404, 'Photo not found');
    return next(err);
  }

  if (photo.targets.some(target => target.name === target_name)) {
    res.sendFile(
      path.resolve(`static/images/${photo.name}/targets/${target_name}.png`),
    );
  } else {
    const err = createError(404, 'Target not found');
    return next(err);
  }
});

export const getLeaderboardUsers = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findOne({ name: req.params.photo_name }).exec();

  if (photo === null) {
    const err = createError(404, 'Photo not found');
    return next(err);
  }

  const users = await User.find({ isAnonymous: false, photo: photo._id })
    .sort({ time: 1 })
    .exec();

  res.json(users ?? []);
});

export const getPhotos = asyncHandler(async (req, res, next) => {
  const photos = await Photo.find().exec();
  res.json(photos);
});
