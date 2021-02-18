---
id: start
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

## Installation

```bash
# NPM
npm install rawgraphs-core

# Yarn
yarn add rawgraphs-core
```


To do something useful with rawgraphs-core, we'll need some charts.
Let's use the charts from the rawgraphs-charts package.


```bash
# NPM
npm install rawgraphs-charts

# Yarn
yarn add rawgraphs-charts
```

In this example we'll build a bubblechart


```js

import { chart } from 'rawgraphs-core'
import { bubblechart } from 'rawgraphs-charts'

const div = document.querySelector("#root");

const testData = [
  { x: 10, y: 20 },
  { x: 30, y: 50 },
  { x: 100, y: 20 },
  { x: 50, y: 70 },
];

const mapping = {
  x: {
    value: "x",
  },
  y: {
    value: "y",
  },
};

const viz = chart(testChart, {
  data: testData,
  mapping,
  visualOptions: {
      
  },
});

viz.renderToDOM(div);

```