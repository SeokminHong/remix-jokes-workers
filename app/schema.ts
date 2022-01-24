export type Joke = {
  createdAt: Date;
  updatedAt: Date;
  content: string;
  jokesterId: string;
  jokester: User;
};

export type User = {
  jokes: Joke[];
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};
