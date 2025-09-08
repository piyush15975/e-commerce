import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  _id: string; // Explicitly define _id as string
  email: string;
  password: string;
  cart: Array<{ item: mongoose.Types.ObjectId; quantity: number }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{ item: { type: Schema.Types.ObjectId, ref: 'Item' }, quantity: { type: Number, default: 1 } }],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;