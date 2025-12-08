import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { bedoAsyncStore } from "../core/bedoAsyncStore";

export function useBedoNavigationSync(key?: string) {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && key) {
      bedoAsyncStore.invalidate(key);
    }
  }, [isFocused, key]);
}
