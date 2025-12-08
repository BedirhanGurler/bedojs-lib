import { useEffect, useRef, useState } from "react";
import { bedoStore } from "../core/store";

const computedCache = new Map<string, any>();

export function useBedoComputed<T>(
  key: string,
  selectorFn: (rootState: any) => T
) {
  const [value, setValue] = useState<T>(() => {
    const rootState = bedoStore.get(key);
    const initial = selectorFn(rootState);
    computedCache.set(key, initial);
    return initial;
  });

  const prevValueRef = useRef<T>(value);

  useEffect(() => {
    const sub = bedoStore.subscribe(key, (rootState) => {
      const newVal = selectorFn(rootState);

      if (newVal !== prevValueRef.current) {
        prevValueRef.current = newVal;
        computedCache.set(key, newVal);
        setValue(newVal);
      }
    });

    return () => sub.unsubscribe();
  }, [key]);

  return value;
}
