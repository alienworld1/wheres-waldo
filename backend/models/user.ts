import { Schema, model, Model, Document, Types } from 'mongoose';
import { differenceInMilliseconds } from 'date-fns';

interface IUser extends Document {
  isAnonymous: boolean;
  time?: number;
  name?: string;
  startTime: Date;
  photo: Types.ObjectId;
}

interface IUserMethods {
  getCurrentTime(): number;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  isAnonymous: { type: Boolean, required: true, default: false },
  name: { type: String, default: '' },
  startTime: { type: Date, required: true },
  time: { type: Number },
  photo: { type: Schema.Types.ObjectId, ref: 'Photo' },
});

userSchema.method('getCurrentTime', function (): number {
  const current = new Date();
  return differenceInMilliseconds(current, this.startTime);
});

const User = model<IUser, UserModel>('User', userSchema);
export default User;
