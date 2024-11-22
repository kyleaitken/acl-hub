import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
    isDarkMode: boolean;
}
  
const initialState: PreferencesState = {
    isDarkMode: false,
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
      toggleTheme: (state) => {
        state.isDarkMode = !state.isDarkMode;
      },
      setTheme: (state, action: PayloadAction<boolean>) => {
        state.isDarkMode = action.payload;
      },
    },
});
  
export const { toggleTheme, setTheme } = preferencesSlice.actions;
export default preferencesSlice.reducer;