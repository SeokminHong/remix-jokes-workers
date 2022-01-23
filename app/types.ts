declare global {
  let REMIX_JOKE: KVNamespace;
}

export type Joke = {
  createdAt: Date;
  updatedAt: Date;
  content: string;
};
