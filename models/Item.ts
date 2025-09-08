import mongoose, { Schema, Document, Model } from 'mongoose';

interface IItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;  // Optional, can add placeholder URLs
}

const itemSchema: Schema<IItem> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
});

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', itemSchema);

export default Item;