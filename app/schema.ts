export type Joke = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  jokesterId: string;
  jokester: User;
};

export type User = {
  username: string;
  jokes: Joke[];
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};
