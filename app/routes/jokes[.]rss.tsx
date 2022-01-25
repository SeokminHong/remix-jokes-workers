import type { LoaderFunction } from "remix";
import { Joke } from "~/schema";

function escapeCdata(s: string) {
  return s.replaceAll("]]>", "]]]]><![CDATA[>");
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getByteLength(s: string) {
  let b = 0,
    c;
  for (let i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
  return b;
}

export const loader: LoaderFunction = async ({ request }) => {
  const keys = await REMIX_JOKE.list().then((jokes) =>
    jokes.keys.map(({ name }) => name)
  );
  let jokes = await Promise.all(
    keys.map((key) => REMIX_JOKE.get<Joke>(key, "json"))
  ).then((jokes) => jokes.filter((joke) => joke !== null) as Joke[]);
  jokes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;
  const jokesUrl = `${domain}/jokes`;

  const rssString = `
    <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${jokesUrl}</link>
        <description>Some funny jokes</description>
        <language>en-us</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${jokes
          .map((joke) =>
            `
            <item>
              <title><![CDATA[${escapeCdata(joke.name)}]]></title>
              <description><![CDATA[A funny joke called ${escapeHtml(
                joke.name
              )}]]></description>
              <author><![CDATA[${escapeCdata(joke.jokesterId)}]]></author>
              <pubDate>${joke.createdAt.toUTCString()}</pubDate>
              <link>${jokesUrl}/${joke.name}</link>
              <guid>${jokesUrl}/${joke.name}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(getByteLength(rssString)),
    },
  });
};
