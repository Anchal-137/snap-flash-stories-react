
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("ThemeProvider initialized");
    
    // Get stored theme from localStorage or use system preference
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme) {
      console.log("Using stored theme:", storedTheme);
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      console.log("Using system preference theme:", initialTheme);
      setTheme(initialTheme);
      applyTheme(initialTheme);
      localStorage.setItem("theme", initialTheme);
    }
    
    setIsInitialized(true);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      console.log("System theme preference changed:", newTheme);
      if (!localStorage.getItem("theme")) {
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const applyTheme = (theme: Theme) => {
    console.log("Applying theme:", theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      
      // Apply dark mode styles to body as well
      document.body.style.backgroundColor = '#000';
      document.body.style.color = '#fff';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      
      // Apply light mode styles to body
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#000';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggle theme:", theme, "->", newTheme);
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!isInitialized) {
    return null; // Prevent flash of incorrect theme
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
