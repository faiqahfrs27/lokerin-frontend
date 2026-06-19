import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("dev-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button className="theme-toggle" onClick={toggle} type="button" title={label} aria-label={label}>
      {theme === "dark" ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  );
}

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("dev-theme") as Theme) || "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default ThemeToggle;