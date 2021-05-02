import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
      minLength: 4,
      unique: true,
    },
  },
  { timestamps: true }
);

export default model('Category', categorySchema);
