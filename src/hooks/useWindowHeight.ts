import { useState, useEffect } from "react";

// https://ryotarch.com/javascript/react/get-window-size-with-react-hooks/
const getWindowHeight = () => {
  return window.innerHeight;
};

export const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState(getWindowHeight());
  useEffect(() => {
    const onResize = () => {
      setWindowHeight(getWindowHeight());
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });
  return windowHeight;
};
