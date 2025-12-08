import { SubscribersMap } from "./subscribers";
import { BedoValue, Store, Subscriber, Subscription } from "./types";

class BedoStore implements Store {
  private state: Map<string, BedoValue> = new Map();
  private subscribers = new SubscribersMap();

  get(key: string): BedoValue {
    return this.state.get(key);
  }
  set(key: string, value: BedoValue): void {
    const prev = this.state.get(key);
    if (prev !== value) {
      this.state.set(key, value);
      this.subscribers.notify(key, value);
    }
  }
  subscribe(key: string, cb: (value: BedoValue) => void) {
    return this.subscribers.add(key, cb);
  }
}

export const bedoStore = new BedoStore();
