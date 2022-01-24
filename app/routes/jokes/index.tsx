import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import type { Joke } from "~/schema";

type LoaderData = { randomJoke: Joke; name: string } | null;

export const loader: LoaderFunction = async () => {
  const { keys } = await REMIX_JOKE.list();

  if (keys.length === 0) {
    return null;
  }

  const randIndex = Math.floor(Math.random() * keys.length);
  const name = keys[randIndex].name;

  const data = (await REMIX_JOKE.get(name, "json")) as Joke | null;
  if (data === null) {
    return null;
  }

  return { randomJoke: data, name };
};

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return data ? (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.name}>"{data.name}" Permalink</Link>
    </div>
  ) : (
    <div>There's no joke yet!</div>
  );
}
