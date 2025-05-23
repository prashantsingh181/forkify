# 🍴 Forkify

Forkify is a TypeScript-based modern recipe web application built using [Vite](https://vitejs.dev/). It follows the MVC architectural pattern and integrates with a recipe API, allowing users to search, view, bookmark, and even add their own recipes.

## 🚀 Live Preview

👉 [Click here to view the live app](https://forkify181.netlify.app/)

## 🔍 Features

- **Search Recipes**: Search for recipes from an external API.
- **View Recipe Details**: Click on a recipe to view detailed instructions, cooking time, servings, and ingredients.
- **Bookmark Recipes**: Bookmark favorite recipes which persist via `localStorage`.
- **Create Your Own Recipe**: Submit a new recipe using a validated form, which sends a `POST` request to the API.
- **Feedback States**:
  - Displays **spinner** while loading.
  - Shows **error messages** for failed API calls or invalid input.
  - Shows **empty state messages** when no data is available.

## 🛠️ Tech Stack

- **TypeScript**
- **Vite**
- **HTML & SCSS**
- **MVC Architecture**
- **LocalStorage API**
- **REST API Integration**

## 💡 Architecture

The app follows the **Model-View-Controller (MVC)** pattern:

- **Model**: Manages application state and handles all API interactions.
- **View**: Modular components for UI (recipe view, results view, bookmarks, etc.).
- **Controller**: Acts as the central hub to coordinate between Model and View.

## 🖼️ UI Features

- Responsive layout
- Form input validations
- Conditional UI updates (e.g., spinner, error, empty state)

## 🗃️ Data Persistence

- Bookmarked recipes are stored in `localStorage` so they persist across sessions.
