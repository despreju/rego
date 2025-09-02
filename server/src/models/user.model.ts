import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  login: string;
  password: string;
  email?: string;
  name?: string;
  firstname?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  name: { type: String, required: false },
  firstname: { type: String, required: false }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);