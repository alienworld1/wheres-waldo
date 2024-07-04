import { Schema, model } from "mongoose";

interface IPosition {
  x: number;
  y: number;
}

interface ITarget {
  name: string;
  position: IPosition;
}

interface IPhoto {
  name: string;
  targets: ITarget;
}

const photoSchema = new Schema<IPhoto>({
  name: { type: String, required: true },
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

const Photo = model<IPhoto>("Photo", photoSchema);

export default Photo;
export { IPhoto };
