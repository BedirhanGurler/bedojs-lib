export type BedoEventCallback = (payload?: any) => void;

export class BedoEventBus {
  private events: Map<string, Set<BedoEventCallback>> = new Map();

  on(eventName: string, cb: BedoEventCallback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const set = this.events.get(eventName)!;
    set.add(cb);

    return {
      unsubscribe: () => set.delete(cb),
    };
  }

  emit(eventName: string, payload?: any) {
    const listeners = this.events.get(eventName);
    if (!listeners) return;

    listeners.forEach((cb) => cb(payload));
  }

  clear(eventName?: string) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

export const bedoEvents = new BedoEventBus();
