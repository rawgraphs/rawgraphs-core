---
id: chart-utilities
title: Chart utilities
sidebar_label: Chart utilities
slug: /chart-utilities
---

RAWGraphs core provides a set of utility functions that can be used in the `render` function of a chart implementation.

## Legends

This library includes utilities to generate legends like the ones seen in charts of the RAWGraphs app.

These utilities may be used in svg charts rendered using the **d3** library, as are based on d3 scales to automatically
draw legends for color and size scales.

Here's an example of the legend displayed in a **bubblechart** from the RAWGraphs app:

![Legend in bubble chart](../static/img/bubble-legend.svg)

[Here](https://github.com/rawgraphs/rawgraphs-charts/blob/master/src/bubblechart/render.js#L224) you can see an example of using these functions in the bubble chart
from the [rawgraphs-charts repository](https://github.com/rawgraphs/rawgraphs-charts).

## Labels occlusion

One recurring problem when implementing visualisations is the collision of labels.

If the chart rendering is based on d3 and your using the `data` method of a `selection` to generate the viz,
the **`labelsOcclusion`** utility helps you solve this problem.

The function takes a d3 selection and the function for getting the priority for each datum.
Here's an usage example:

```js

  import { labelsOcclusion } from 'rawgraphs-core'  
  import { d3 } from 'd3'

  
  const svg = d3.select('#somediv').append("svg")
  const labelsLayer = svg.append("g").attr("id", "labels");

  const data = [
      { x: 1, y: 1, label: "hello", size: 10 },
      { x: 2, y: 1, label: "from", size: 30 },
      { x: 3, y: 2, label: "rawgraphs", size: 10 },
      ...
   ]
  
  labelsLayer
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${d.x * 10},${d.y * 10})`)
      .append("text")
      .text((d) => d.label)
      
  labelsOcclusion(labelsLayer.selectAll('text'), (d) => d.size)

```

You can see the utility in action in the **beeswarm** chart in the RAWGraphs app, when setting to `true` the **Auto hide labels** visual option:

![Labels occlusion in beeswarm](../static/img/beeswarm-occlusion.svg)

[Here](https://github.com/rawgraphs/rawgraphs-charts/blob/master/src/beeswarm/render.js#L271) you can see an example of using the function in the beeswarm
from the [rawgraphs-charts repository](https://github.com/rawgraphs/rawgraphs-charts).
