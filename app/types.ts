declare global {
  let REMIX_JOKE: KVNamespace;
}

export type Joke = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  content: string;
};
