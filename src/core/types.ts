export type BedoValue = any;
export type Subscriber = (value: BedoValue) => void;
export interface Subscription {
  unsubscribe: () => void;
}

export interface Store {
  get: (key: string) => BedoValue;
  set: (key: string, value: BedoValue) => void;
  subscribe: (key: string, cb: Subscriber) => Subscription;
}
