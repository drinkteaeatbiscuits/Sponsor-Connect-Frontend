import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  let content = document.querySelector("ion-content");

  useEffect(() => {

        content?.scrollToPoint(0, 0);
  
    }, [pathname]);

  return null;
}