import { useEffect, useState } from "react";
import { bedoStore } from "../core/store";

/**
 * Supports deep key paths like:
 * "filters"  => whole object
 * "filters.day" => nested read
 */
function getValueByPath(obj: any, path: string) {
  if (!obj) return undefined;
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

    const sub = bedoStore.subscribe(rootKey, (newVal) => {
      const newSelected = getValueByPath(newVal, fullKey.replace(`${rootKey}.`, ""));

      // shallow compare for selector
      if (newSelected !== selected) {
        setSelected(newSelected);
      }
    });

    return () => sub.unsubscribe();
  }, [fullKey, selected]);

  return selected;
}
