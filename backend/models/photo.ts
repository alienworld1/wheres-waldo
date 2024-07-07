import { Schema, model, Document, Model } from 'mongoose';

interface IPosition {
  x: number;
  y: number;
}

interface ITarget {
  name: string;
  position: IPosition;
}

interface IPhoto extends Document {
  name: string;
  targets: ITarget[];
}

interface IPhotoMethods {
  url(): string;
}

export enum ImageType {
  main = 'main',
  preview = 'preview',
}

type PhotoModel = Model<IPhoto, {}, IPhotoMethods>;

const photoSchema = new Schema<IPhoto, PhotoModel, IPhotoMethods>({
  name: { type: String, required: true, unique: true },
  targets: [
    {
      name: { type: String, required: true },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    },
  ],
});

photoSchema.method('url', function (imageType: ImageType) {
  return `/photos/${this.name}/${imageType}`;
});

const Photo = model<IPhoto, PhotoModel>('Photo', photoSchema);

export default Photo;
export { IPhoto };
