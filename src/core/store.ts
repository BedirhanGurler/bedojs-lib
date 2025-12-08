import { Store, BedoValue } from "./types";
import { SubscribersMap } from "./subscribers";

class BedoStore implements Store {
  private state: Map<string, BedoValue> = new Map();
  private subscribers = new SubscribersMap();

  private batching = false;
  private pendingKeys = new Set<string>();

  get(key: string): BedoValue {
    return this.state.get(key);
  }

  set(key: string, value: BedoValue): void {
    const prev = this.state.get(key);

    if (prev !== value) {
      this.state.set(key, value);

      if (this.batching) {
        this.pendingKeys.add(key);
      } else {
        this.subscribers.notify(key, value);
      }
    }
  }

  batch(fn: () => void) {
    this.batching = true;

    try {
      fn();
    } finally {
      this.batching = false;

      this.pendingKeys.forEach((key) => {
        const value = this.state.get(key);
        this.subscribers.notify(key, value);
      });

      this.pendingKeys.clear();
    }
  }

  subscribe(key: string, cb: (value: BedoValue) => void) {
    return this.subscribers.add(key, cb);
  }
}

export const bedoStore = new BedoStore();
