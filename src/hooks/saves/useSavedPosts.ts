import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '@/store';
import {
  addSavedPost,
  removeSavedPost,
  toggleSavedPost,
} from '@/store/slices/savedPostsSlice';

export const useSavedPosts = () => {
  const savedIds = useSelector((state: RootState) => state.savedPosts.savedIds);
  const dispatch = useDispatch<AppDispatch>();

  const isSaved = (postId: number) => savedIds.includes(postId);
  const add = (postId: number) => dispatch(addSavedPost(postId));
  const remove = (postId: number) => dispatch(removeSavedPost(postId));
  const toggle = (postId: number) => dispatch(toggleSavedPost(postId));

  return { savedIds, isSaved, add, remove, toggle };
};
