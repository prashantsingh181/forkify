export interface FailResponse {
  status: 'fail';
  message: string;
}

export interface SuccessResponse<T> {
  status: 'success';
  results?: number;
  data: T;
}
export interface Ingredient {
  quantity: number | null;
  unit: string;
  description: string;
}

export interface RecipeAPIBase {
  id: string;
  publisher: string;
  image_url: string;
  title: string;
}

export interface RecipeAPI extends RecipeAPIBase {
  ingredients: Ingredient[];
  source_url: string;
  servings: number;
  cooking_time: number;
}

export interface RecipeBase {
  id: string;
  publisher: string;
  imageUrl: string;
  title: string;
  active: boolean;
  key?: string;
}

export interface Recipe extends RecipeBase {
  ingredients: Ingredient[];
  sourceUrl: string;
  servings: number;
  cookingTime: number;
  bookmarked: boolean;
}

export type APIResponse<T> = FailResponse | SuccessResponse<T>;
export type RecipeResponse =
  | FailResponse
  | SuccessResponse<{ recipe: RecipeAPI }>;

export type RecipeForm = {
  publisher: string;
  image_url: string;
  title: string;
  source_url: string;
  servings: string;
  cooking_time: string;
  'ingredient-1': string;
  'ingredient-2': string;
  'ingredient-3': string;
  'ingredient-4': string;
  'ingredient-5': string;
  'ingredient-6': string;
};

export type ValidationObject = {
  required?: { value: boolean; message?: string };
  minLength?: { value: number; message?: string };
  maxLength?: { value: number; message?: string };
  regex?: { value: RegExp; message?: string };
};
