import { Subscriber, Subscription } from "./types";

export class SubscribersMap {
  private map: Map<string, Set<Subscriber>> = new Map();

  add(key: string, cb: Subscriber): Subscription {
    if (!this.map.has(key)) {
      this.map.set(key, new Set());
    }

    const set = this.map.get(key)!;
    set.add(cb);

    return {
      unsubscribe: () => {
        set.delete(cb);
      },
    };
  }

  notify(key: string, value: any) {
    const subs = this.map.get(key);
    if (!subs) return;

    subs.forEach((cb) => cb(value));
  }
}
