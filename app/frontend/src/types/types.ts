export interface AuthState {
  token: string | null;
  role: string | null;
}

export interface PreferencesState {
  isDarkMode: boolean;
}

export interface RootState {
  auth: AuthState;
  preferences: PreferencesState;
}
