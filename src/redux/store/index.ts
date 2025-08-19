import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authSlice from '@/src/redux/slices/authSlice';
import quizSlice from '@/src/redux/slices/quizSlice';
import leaderboardSlice from '@/src/redux/slices/leaderboardSlice';
import gameSlice from '@/src/redux/slices/gameSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    quiz: quizSlice,
    leaderboard: leaderboardSlice,
    game: gameSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;