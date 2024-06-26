import { Schema, model } from 'mongoose';
import { handleSaveError } from '../routes/hooks.js';

const recipesSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for recipe'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Set category for recipe'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Set owner for recipe'],
    },
    area: {
      type: Schema.Types.ObjectId,
      ref: 'Area',
      required: [true, 'Set area for recipe'],
    },
    instructions: {
      type: String,
      required: [true, 'Set instructions for recipe'],
    },
    description: {
      type: String,
      required: [true, 'Set description for recipe'],
    },
    thumb: {
      type: String,
      required: [true, 'Set image for recipe'],
    },
    time: {
      type: Number,
      required: [true, 'Set cooking time for recipe'],
    },
    ingredients: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredient',
          required: [true, 'Set ingredient ID'],
        },
        measure: {
          type: String,
          required: [true, 'Set ingredient measure'],
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

recipesSchema.post('save', handleSaveError);
const Recipe = model('Recipe', recipesSchema);

export default Recipe;
