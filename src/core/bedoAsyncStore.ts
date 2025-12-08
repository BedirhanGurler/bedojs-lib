import { BedoEventCallback } from "./bedoEvents";

type AsyncStatus = "idle" | "loading" | "success" | "error";

interface AsyncEntry<T> {
  data?: T;
  error?: any;
  status: AsyncStatus;
  updatedAt?: number;
  promise?: Promise<T>;
  staleTime?: number;
}

export class BedoAsyncStore {
  private cache = new Map<string, AsyncEntry<any>>();
  private invalidationListeners = new Map<string, Set<BedoEventCallback>>();

  get<T>(key: string): AsyncEntry<T> | undefined {
    return this.cache.get(key);
  }

  set<T>(key: string, entry: Partial<AsyncEntry<T>>) {
    const prev = this.cache.get(key) || { status: "idle" };
    const next = { ...prev, ...entry };
    this.cache.set(key, next);
  }

  invalidate(key: string) {
    this.cache.delete(key);

    const listeners = this.invalidationListeners.get(key);
    if (listeners) {
      listeners.forEach((cb) => cb());
    }
  }

  onInvalidation(key: string, cb: BedoEventCallback) {
    if (!this.invalidationListeners.has(key)) {
      this.invalidationListeners.set(key, new Set());
    }

    const set = this.invalidationListeners.get(key)!;
    set.add(cb);

    return {
      unsubscribe: () => {
        set.delete(cb);
      },
    };
  }
}

export const bedoAsyncStore = new BedoAsyncStore();
