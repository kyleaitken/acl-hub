import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'fun';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        console.log(get().theme);
        const current = get().theme;
        if (current === 'dark') {
            set({theme: 'light'});
            applyThemeClass('light');
        } else {
            set({theme: 'dark'});
            applyThemeClass('dark');
        }
      },
      setTheme: (theme: Theme) => {
        set({ theme });
        applyThemeClass(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

function applyThemeClass(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('light', 'dark', 'fun');
  html.classList.add(theme);
}
