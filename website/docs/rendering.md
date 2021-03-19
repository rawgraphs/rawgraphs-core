---
id: rendering
title: Rendering charts
sidebar_label: Rendering charts
slug: /rendering
---


The following is a simple example of rendering a chart with rawgraphs-core:

```js
// 1. imports: chart factory function and chart implementation
import { chart } from '@rawgraphs/rawgraphs-core'
import { bubblechart } from '@rawgraphs/rawgraphs-charts'

// 2. defining data
const data = [{age:10, height:130}, {age:18, height:170}]

// 3. defining mapping
const mapping = { x: { value: 'age' }, y: { value: 'height' } }

// 4. creating a chart instance
const viz = new chart(bubblechart { data, mapping})

// 5. rendering to the DOM
const targetNode = document.getElementById('some-div')
viz.renderToDOM(targetNode)
```

Let's analyze the imports, variables and methods call we introduced in this snippet.

## 1. Imports: chart factory function and chart implementation
Here we're importing the `chart` function from 'rawgraphs-core' (this library). 
We'll also need an actual **chart implementation** and we'll using a `bubblechart` from [@rawgraphs/rawgraphs-charts](https://github.com/rawgraphs/rawgraphs-charts),
the official charts package used in the RAWGraphs app.

## 2. Defining `data`
The data that must be rendered. RAWGraphs expects tabular data as input, in particular a list of objects,
that should all have the same property names. Those property names (the **columns** of the tabular dataset) will be
used as in **mapping**.

In our example we have a dataset with columns 'age' and 'height' (two numbers), and two data points.



## 3. Defining `mapping` 
The **mapping** object is used to "map" the chart semantics to the columns of the dataset. 
It should be an object where: 

- keys represent **dimension** of the chart we're going to render
- values are objects with a **value** property that should contain one or more columns of the dataset 


## 4. Creating a chart instance (`viz`)
In rawgraphs-core, high level operations, such as chart rendering, are implemented by the`Chart` class.

To get an instance of this class, we use the `chart` factory function from 'rawgraphs-core'. 

### chart(visualModel, config) ⇒ [<code>Chart</code>](#Chart)
This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class and takes two parameters:

| Param | Type |
| --- | --- |
| chartImplementation | [<code>ChartImplementation</code>](#ChartImplementation) | 
| config | [<code>RawConfig</code>](#RawConfig) | 


The first parameter, the `chartImplementation` is a chart object conforming the [chart interface](chart-interface.md).

The second parameter, the `config` object, has following properties:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> |  | the tabular data to be represented |
| dataTypes | [<code>DataTypes</code>](#DataTypes) |  | object with data types annotations (column name => type name) |
| mapping | [<code>Mapping</code>](#Mapping) |  | the current mapping of column names to dimensions of the current visual model |
| [visualOptions] | [<code>VisualOptions</code>](#VisualOptions) | <code>{}</code> | visual options values |
| [styles] | <code>Object</code> | <code>{}</code> | css in js styles definitions |



## 5. Rendering to the DOM
Once we have a chart instance, we're ready to render in to the DOM.
First, we must get an instance of valid DOM node, in our case we're using the `getElementById` method of the current document. This node will be the container of our visualization.

To render the chart, we call the `renderToDOM` method of our chart instance, which has the following signature

### chart.renderToDOM(domNode) ⇒ [<code>DOMChart</code>](api.md#domchart)

this function call will draw the chart in your document and return an instance of the `DOMChart` class, which extends the `Chart` class and has an internal reference to the DOM node.

:::info
At the moment rawgraphs-core has not support for **updating** a chart once it's rendered. In the `renderToDOM` method, the target dom node inner html is always cleaned before proceeding to the actual chart rendering.
:::
