import { useState } from "react";
import { UIContext } from "./UIContext";

export function UIProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </UIContext.Provider>
  );
}