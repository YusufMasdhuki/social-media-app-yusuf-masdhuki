import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SavedPostsState {
  savedIds: number[]; // array postId yang tersimpan
}

const initialState: SavedPostsState = {
  savedIds: [],
};

export const savedPostsSlice = createSlice({
  name: 'savedPosts',
  initialState,
  reducers: {
    addSavedPost: (state, action: PayloadAction<number>) => {
      if (!state.savedIds.includes(action.payload)) {
        state.savedIds.push(action.payload);
      }
    },
    removeSavedPost: (state, action: PayloadAction<number>) => {
      state.savedIds = state.savedIds.filter((id) => id !== action.payload);
    },
    toggleSavedPost: (state, action: PayloadAction<number>) => {
      if (state.savedIds.includes(action.payload)) {
        state.savedIds = state.savedIds.filter((id) => id !== action.payload);
      } else {
        state.savedIds.push(action.payload);
      }
    },
    setSavedPosts: (state, action: PayloadAction<number[]>) => {
      state.savedIds = action.payload;
    },
  },
});

export const { addSavedPost, removeSavedPost, toggleSavedPost, setSavedPosts } =
  savedPostsSlice.actions;
export default savedPostsSlice.reducer;
