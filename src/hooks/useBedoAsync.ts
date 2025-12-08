import { useEffect, useState } from "react";
import { bedoAsyncStore } from "../core/bedoAsyncStore";

interface UseBedoAsyncOptions {
  staleTime?: number;
  auto?: boolean; // auto fetch on mount
}

export function useBedoAsync<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseBedoAsyncOptions = { staleTime: 0, auto: true }
) {
  const [_, forceRender] = useState(0);

  const entry = bedoAsyncStore.get<T>(key);

  const isStale = () => {
    if (!entry?.updatedAt) return true;
    if (!options.staleTime) return true;
    return Date.now() - entry.updatedAt > options.staleTime;
  };

  const refreshUI = () => forceRender((x) => x + 1);

  const refetch = async () => {
    if (entry?.promise) return entry.promise;

    const promise = fetcher()
      .then((response) => {
        bedoAsyncStore.set(key, {
          status: "success",
          data: response,
          error: undefined,
          updatedAt: Date.now(),
          promise: undefined,
          staleTime: options.staleTime,
        });
        refreshUI();
        return response;
      })
      .catch((err) => {
        bedoAsyncStore.set(key, {
          status: "error",
          error: err,
          promise: undefined,
        });
        refreshUI();
        throw err;
      });

    bedoAsyncStore.set(key, {
      status: "loading",
      promise,
      error: undefined,
    });

    refreshUI();
    return promise;
  };

  useEffect(() => {
    if (!entry) {
      refetch();
    } else if (options.auto && isStale()) {
      refetch();
    }

    const sub = bedoAsyncStore.onInvalidation(key, () => {
      refetch();
    });

    return () => sub.unsubscribe();
  }, [key]);

  return {
    data: entry?.data,
    loading: entry?.status === "loading",
    error: entry?.error,
    refetch,
    status: entry?.status || "idle",
  };
}
