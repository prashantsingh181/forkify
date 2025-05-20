import type { Recipe } from '../../types';

class BookmarkModel {
  private _bookmarks: Recipe[] = [];
  private readonly _storageKey: string = 'bookmarks';

  get bookmarks() {
    return this._bookmarks;
  }
  set bookmarks(bookmarks: Recipe[]) {
    this._bookmarks = bookmarks;
  }

  load() {
    try {
      const storageBookmark = localStorage.getItem(this._storageKey);
      if (storageBookmark) {
        const bookmarks = JSON.parse(storageBookmark);
        this.bookmarks = bookmarks;
      }
    } catch (error) {
      console.error('Error in parsing bookmarks', error);
    }
  }

  has(bookmarkId: string) {
    return this.bookmarks.some(bookmark => bookmark.id === bookmarkId);
  }
  save() {
    localStorage.setItem(this._storageKey, JSON.stringify(this.bookmarks));
  }

  clear() {
    localStorage.removeItem(this._storageKey);
  }

  setActive(recipeId: string | null) {
    this.bookmarks = this.bookmarks.map(bookmark => ({
      ...bookmark,
      active: bookmark.id === recipeId,
    }));
    this.save();
  }

  addBookmark(bookmark: Recipe) {
    this.bookmarks.push(bookmark);
    this.save();
  }

  removeBookmark(bookmarkId: string) {
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== bookmarkId
    );
    this.save();
  }
}

export default new BookmarkModel();
