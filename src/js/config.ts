export const TIMEOUT_SEC = 10;
export const DEBOUNCE_SEC = 0.4;
export const MAX_SERVINGS_ALLOWED = 20;
export const ADD_RECIPE_FORM_VALIDATION_RULES = {
  title: {
    required: { value: true, message: 'Title is required' },
    minLength: {
      value: 6,
      message: 'Title should be at least 6 characters long',
    },
  },
  publisher: {
    required: { value: true, message: 'Publisher is required' },
    minLength: {
      value: 3,
      message: 'Publisher should be at least 3 characters long',
    },
  },
  image_url: {
    required: { value: true, message: 'Image URL is required' },
    regex: {
      value: /^(http|https):\/\/[^ "]+$/,
      message: 'Image URL is not valid',
    },
  },
  source_url: {
    required: { value: true, message: 'Source URL is required' },
    regex: {
      value: /^(http|https):\/\/[^ "]+$/,
      message: 'Source URL is not valid',
    },
  },
  servings: { required: { value: true, message: 'Servings is required' } },
  cooking_time: {
    required: { value: true, message: 'Cooking time is required' },
  },
  'ingredient-1': {
    required: { value: true },
    regex: {
      value: /^((.*,){2}.*)?$/,
      message: 'Please write three comma separated values.',
    },
  },
  'ingredient-2': {
    regex: {
      value: /^((.*,){2}.*)?$/,
      message: 'Please write three comma separated values.',
    },
  },
  'ingredient-3': {
    regex: {
      value: /^((.*,){2}.*)?$/,
      message: 'Please write three comma separated values.',
    },
  },
  'ingredient-4': {
    regex: {
      value: /^((.*,){2}.*)?$/,
      message: 'Please write three comma separated values.',
    },
  },
  'ingredient-5': {
    regex: {
      value: /^((.*,){2}.*)?$/,
      message: 'Please write three comma separated values.',
    },
  },
  'ingredient-6': {
    regex: {
      value: /^((.*,){2}.*)?$/,
      message: 'Please write three comma separated values.',
    },
  },
};
