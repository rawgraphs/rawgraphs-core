# Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator. It requires Node.js 20 or newer.

The docs in `docs/` are plain Markdown (parsed as CommonMark, see `markdown.format` in `docusaurus.config.js`). `docs/api.md` is generated from the JSDoc comments in `../src` with `npm run doc2md` run from the repository root: don't edit it by hand.

## Installation

```console
npm install
```

## Local Development

```console
npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Broken links fail the build.

## Deployment

```console
GIT_USER=<Your GitHub username> USE_SSH=true npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
