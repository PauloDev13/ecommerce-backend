import { Schema, model } from 'mongoose';
import crypto from 'crypto';
import { v1 } from 'uuid';

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 100,
      minLength: 6,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Virtual Schema
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = v1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';

    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

export default model('User', userSchema);
