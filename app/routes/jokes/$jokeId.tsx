import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { Link, useLoaderData, useCatch, useParams, redirect } from "remix";
import type { Joke } from "~/schema";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found",
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`,
  };
};

type LoaderData = { joke: Joke; isOwner: boolean };

export const loader: LoaderFunction = async ({ request, params }) => {
  if (typeof params.jokeId === "undefined") {
    throw new Response("Invalid Request.", {
      status: 400,
    });
  }
  const joke = (await REMIX_JOKE.get(params.jokeId, "json")) as Joke | null;
  if (joke === null) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  const userId = await getUserId(request);
  return { joke, name: params.jokeId, isOwner: userId === joke.jokesterId };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (!params.jokeId) {
    throw new Response("Invalid Request.", { status: 400 });
  }
  if (form.get("_method") === "delete") {
    const userId = await requireUserId(request);
    const joke = (await REMIX_JOKE.get(
      params.jokeId || "",
      "json"
    )) as Joke | null;
    if (!joke) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 401,
      });
    }
    await REMIX_JOKE.delete(params.jokeId);
    return redirect("/jokes");
  }
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
      {data.isOwner ? (
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="button">
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
