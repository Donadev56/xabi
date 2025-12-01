"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = ({ size =35}: { size?: number }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  return (
    <div
      style={{ width: size || 32, height: size || 32, minHeight: size || 32, maxWidth: size || 32, maxHeight: size || 32 , minWidth: size || 32 }}
      className="border items-center justify-center flex rounded-[50px]"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </div>
  );
};

export default ThemeToggle;
