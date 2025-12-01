"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = ({ size = 35 }: { size?: number }) => {
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
      style={{
        width: size,
        height: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        minWidth: size,
      }}
      className="border items-center justify-center flex rounded-[50px]"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon size={size - 10} />
      ) : (
        <MoonIcon size={size - 10} />
      )}
    </div>
  );
};

export default ThemeToggle;
