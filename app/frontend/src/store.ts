import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { useDispatch } from 'react-redux';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './slices/auth/authSlice';
import preferencesReducer from './slices/preferences/preferencesSlice'
import usersReducer from './slices/coach/usersSlice'
import workoutsReducer from './slices/coach/workoutsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  preferences: preferencesReducer,
  users: usersReducer,
  workouts: workoutsReducer
});


const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage,
  whitelist: ['auth', 'preferences', 'users', 'workouts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Fix for persist non-serializable data error https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignoring only redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);


// Type for Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;