import { useEffect, useState } from "react";
import { bedoStore } from "../core/store";

/**
 * Supports deep key paths like:
 * "filters"      => whole object
 * "filters.day"  => nested read
 */
function getValueByPath(obj: any, path: string) {
  if (!obj) return undefined;
  if (!path) return obj;

  const parts = path.split(".");
  let current = obj;

  for (const p of parts) {
    if (current == null) return undefined;
    current = current[p];
  }

  return current;
}

export function useBedoSelector<T = any>(fullKey: string) {
  const [selected, setSelected] = useState<T>(() => {
    const [rootKey] = fullKey.split(".");
    const stateRoot = bedoStore.get(rootKey);
    return getValueByPath(stateRoot, fullKey.replace(`${rootKey}.`, ""));
  });

  useEffect(() => {
    const [rootKey] = fullKey.split(".");

    const unsubscribe = bedoStore.subscribe(rootKey, (newVal) => {
      const newSelected = getValueByPath(
        newVal,
        fullKey.replace(`${rootKey}.`, "")
      );

      setSelected((prev) => (prev !== newSelected ? newSelected : prev));
    });

    return () => unsubscribe.unsubscribe();
  }, [fullKey]);

  return selected;
}
