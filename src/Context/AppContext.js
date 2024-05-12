import { createContext, useState, useMemo } from 'react';
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ isLoggedIn: false, role: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [hasViewedOnboarding, setHasViewedOnboarding] = useState(false);
  const [orientationHoz, setOrientationHoz] = useState(false);

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      if (orientationInfo.orientation === 1) {
        setOrientationHoz(false);
      } else {
        setOrientationHoz(true);
      }
    });
  }, []);
  const appContextValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      user,
      setUser,
      hasViewedOnboarding,
      setHasViewedOnboarding,
      orientationHoz,
    }),
    [user, isLoading, hasViewedOnboarding, orientationHoz]
  );

  if (user === undefined) {
    return null;
  }

  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>;
};
