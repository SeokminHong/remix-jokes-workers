import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import type { Joke } from "~/types";

type LoaderData = { joke: Joke } | null;

export const loader: LoaderFunction = async ({ params }) => {
  if (typeof params.jokeId === "undefined") {
    return null;
  }
  const joke = (await REMIX_JOKE.get(params.jokeId, "json")) as Joke | null;
  if (joke === null) {
    return null;
  }
  return { joke };
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  console.log(data);

  return data ? (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  ) : (
    <div>Cannot find a joke</div>
  );
}
