export type EventPayload = {
  id?: string;
  name: string;
  price: string;
  datetime: Date;
  image: string;
};

export type Event = {
  id: string;
  name: string;
  price: number;
  datetime: string; // or `Date` if parsed already
  image: string;
};
