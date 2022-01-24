# Jokes App for Cloudflare Workers

[Live Demo](https://remix-cloudflare-workers.seokmin.workers.dev)

tutorial: https://remix.run/docs/en/v1/tutorials/jokes

## TODO

- [x] Add routes
- [x] Add styles
- [x] Setup a KV storage
- [x] Implement actions
- [x] Authentication
- [x] Error handling
- [x] SEO
- [x] Resource routes
- [x] Add scripts
- [x] Optimistic UI
- [x] Deploy

## Development

You will be running two processes during development:

- The Miniflare server (miniflare is a local environment for Cloudflare Workers)
- The Remix development server

```sh
$ npm start
```

Open up [http://127.0.0.1:8787](http://127.0.0.1:8787) and you should be ready to go!

## Deployment

Use [wrangler](https://developers.cloudflare.com/workers/cli-wrangler) to build and deploy your application to Cloudflare Workers. If you don't have it yet, follow [the installation guide](https://developers.cloudflare.com/workers/cli-wrangler/install-update) to get it setup. Be sure to [authenticate the CLI](https://developers.cloudflare.com/workers/cli-wrangler/authentication) as well.

If you cannot install wrangler and you are using Windows, retry it after install [Strawberry Perl](https://strawberryperl.com/).

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Next, you should create KV namespaces for your application.

```sh
$ wrangler kv:namespace create REMIX_JOKE
...
{ binding = "REMIX_JOKE", id = "e1076e1120f945d184898c67de69758a" }
$ wrangler kv:namespace create REMIX_JOKE_USER
...
{ binding = "REMIX_JOKE_USER", id = "b9aa11dfa8f54807bc4d5aa141561e10" }
```

Then, add the results in the `wrantler.toml` file.

```toml
kv_namespaces = [
  { binding = "REMIX_JOKE", id = "e1076e1120f945d184898c67de69758a" },
  { binding = "REMIX_JOKE_USER", id = "b9aa11dfa8f54807bc4d5aa141561e10" }
]
```

Also, you should add a secret key to your application.

```sh
$ wrangler secret put SESSION_SECRET
```

If upload fails, remove all `SESSION_SECRET` from the codes and retry. Then, rollback the changes.

Once that's done, you should be able to deploy your app:

```sh
$ npm run deploy
```

Finally, you have to add your secret to your Cloudflare Workers app.
