import type { LoaderFunction } from "remix";
import { Link, useLoaderData, useCatch } from "remix";
import { getJoke, Joke } from "~/schema";

type LoaderData = { randomJoke: Joke; name: string };

export const loader: LoaderFunction = async () => {
  const { keys } = await REMIX_JOKE.list();

  if (keys.length === 0) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }

  const randIndex = Math.floor(Math.random() * keys.length);
  const name = keys[randIndex].name;

  const data = await getJoke(name);
  if (data === null) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }

  return { randomJoke: data, name };
};

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.name}>"{data.name}" Permalink</Link>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no jokes to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
