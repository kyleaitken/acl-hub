// src/store.ts
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
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import Reducers
// import preferencesReducer from './features/preferences/preferencesSlice';
// import programReducer from './features/programs/programSlice';

const rootReducer = combineReducers({
  // programs: programReducer,
  // preferences: preferencesReducer, // slice for theme and other preferences
});


const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage,
  whitelist: [], // persist only the preferences slice
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