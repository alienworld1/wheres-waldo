import asyncHandler from 'express-async-handler';
import path from 'path';

import Photo from '../models/photo';
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
