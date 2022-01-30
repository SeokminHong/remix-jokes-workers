export type Joke = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  jokesterId: string;
};

export type User = {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getJoke(jokeId: string): Promise<Joke | null> {
  const joke = await REMIX_JOKE.get<{
    [K in keyof Joke]: string;
  }>(jokeId, "json");

  if (!joke) {
    return joke;
  }
  return {
    ...joke,
    createdAt: new Date(joke.createdAt),
    updatedAt: new Date(joke.updatedAt),
  };
}

export const SEED_USERS: User[] = [
  {
    username: "kody",
    // this is a hashed version of "twixrox"
    passwordHash:
      "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
  },
];

export const SEED_JOKES: Joke[] = [
  {
    name: "Road worker",
    content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
  {
    name: "Frisbee",
    content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
  {
    name: "Trees",
    content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
  {
    name: "Skeletons",
    content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
  {
    name: "Hippos",
    content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
  {
    name: "Dinner",
    content: `What did one plate say to the other plate? Dinner is on me!`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
  {
    name: "Elevator",
    content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    createdAt: new Date(2022, 1, 10),
    updatedAt: new Date(2022, 1, 10),
    jokesterId: "kody",
  },
];
