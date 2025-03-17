import { useWindowDimensions } from "react-native";

export function useDevice() {
  const { width } = useWindowDimensions();
  
  return {
    isMobile: width < 768,
    isTabletOrDesktop: width >= 768,
  };
}
