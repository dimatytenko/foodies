import HttpError from '../helpers/HttpError.js';
import path from 'path';
import fs from 'fs/promises';
import {
  addRecipeService,
  listAllRecipesService,
  removeRecipeService,
  addToFavoritesService,
  removeFromFavoritesService,
  getFavoriteRecipesService,
  countRecipes,
} from '../services/recipesServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import resizeImage from '../helpers/resizeImg.js';

const thumbRecipeImagesPath = path.resolve('public', 'thumbRecipeImages');

export const getAllOwnRecipes = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 5 } = req.query;
  const filter = { owner };
  const fields = '-createdAt -updatedAt';
  const skip = (page - 1) * limit;
  const settings = { skip, limit };
  const result = await listAllRecipesService({ filter, fields, settings });
  const total = await countRecipes(filter);
  res.json({ total, result });
};

export const deleteOwnRecipe = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await removeRecipeService({ _id, owner });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

export const createOwnRecipe = async (req, res, next) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(thumbRecipeImagesPath, filename);
  resizeImage(oldPath, newPath, 550, 400);
  await fs.unlink(oldPath);
  const { _id: owner } = req.user;
  const thumb = path.join('thumbRecipeImages', filename);
  const result = await addRecipeService({ ...req.body, owner, thumb });
  res.status(201).json(result);
};

export const addToFavorites = async (req, res, next) => {
    const { id: recipeId } = req.body;
    const { _id: userId } = req.user;

    await addToFavoritesService(userId, recipeId);

    res.status(200).json({ message: 'Recipe added to favorites successfully' });
};

export const removeFromFavorites = async (req, res, next) => {
    const { id: recipeId } = req.params;
    const { _id: userId } = req.user;

    await removeFromFavoritesService(userId, recipeId);

    res
      .status(200)
      .json({ message: 'Recipe removed from favorites successfully' });
};

export const getFavoriteRecipes = async (req, res, next) => {
    const { id: userId } = req.user;
    const favorites = await getFavoriteRecipesService(userId);
    res.json({ favorites });
};

export default {
  getAllOwnRecipes: ctrlWrapper(getAllOwnRecipes),
  deleteOwnRecipe: ctrlWrapper(deleteOwnRecipe),
  createOwnRecipe: ctrlWrapper(createOwnRecipe),
  addToFavorites: ctrlWrapper(addToFavorites),
  removeFromFavorites: ctrlWrapper(removeFromFavorites),
  getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
};
