import { useEffect, useState } from "react";
import { bedoStore } from "../core/store";

export function useBedoState<T = any>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const existing = bedoStore.get(key);
    return existing !== undefined ? existing : initial;
  });

  useEffect(() => {
    // initial write if empty
    if (bedoStore.get(key) === undefined) {
      bedoStore.set(key, value);
    }

    const sub = bedoStore.subscribe(key, (v) => {
      setValue(v);
    });

    return () => sub.unsubscribe();
  }, [key]);

  const update = (v: T) => {
    bedoStore.set(key, v);
  };

  return [value, update] as const;
}
