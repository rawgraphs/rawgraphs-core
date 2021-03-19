---
id: install
title: Installation
sidebar_label: Installation
slug: /installation
---

## Environment

The rawgraphs-core library has no strict requirements of a browser envirnonment.
However, as the charts rendering leverages the DOM api (in particular additional apis provided by SVG) the library always needs a valid html document to operate on. 

At the moment we could not find any pure node.js implementation of the DOM api supporting the full svg specification, so **rawgraphs-core is officially fully supported only in a browser environment**.

:::info
It's still possible to use rawgraphs-core in a server environment, for example using the [Puppeteer](https://pptr.dev/) library or some other headless browser, but this is out of the scope of the rawgraphs-core documentation
:::


## Installing from npm

You can install the library from npm, using your favourite package manager:

```bash
# NPM
npm install @rawgraphs/rawgraphs-core

# Yarn
yarn add @rawgraphs/rawgraphs-core
```


## Direct `<script>` inclusion

Another way to install rawgraphs-core, is to directly include it in your html via a `<script>` tag, that will include the UMD build of the library.
In this case we'll use [jsdelivr](https://www.jsdelivr.com/), a free CDN for open source packages.

```html
<script src="https://cdn.jsdelivr.net/npm/@rawgraphs/rawgraphs-core"></script>
```

In this case the rawgraphs-core api will be available in the `raw` object in the global (window) scope.