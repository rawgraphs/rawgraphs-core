---
id: rendering
title: Rendering charts
sidebar_label: Rendering charts
slug: /rendering
---


The following is a simple example of rendering a chart with rawgraphs-core:

```js
import { chart } from 'rawgraphs-core'
import { bubblechart } from 'rawgraphs-charts'

const data = [{age:10, height:130}, {age:18, height:170}]
const mapping = { x: { value: 'age' }, y: { value: 'height' } }

const viz = new chart(bubblechart { data, mapping})

const targetNode = document.getElementByID('some-div')

viz.renderToDOM(targetNode)
```

Let's analyze the variables we introduced in this snippet.

## data
The data that must be rendered. RAWGraphs expects tabular data as input, in particular a list of objects,
that should all have the same property names. Those property names (the **columns** of the tabular dataset) will be
used as in **mapping**.

In our example we have a dataset with columns 'age' and 'height' (two numbers), and two data points.



## mapping
The **mapping** object is used to "map" the chart semantics to the columns of the dataset. 
It should be an object where: 

- keys represent **dimension** of the chart we're going to render
- values are objects with a **value** property that should contain one or more columns of the dataset 


## chart instance (viz)
In rawgraphs-core, high level operations, such as chart rendering, are implemented the `Chart` class.

To get an instance of this class, we provide the `chart` factory function. 

### chart(visualModel, config) ⇒ [<code>Chart</code>](#Chart)
This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class and takes two parameters:

| Param | Type |
| --- | --- |
| chartImplementation | [<code>ChartImplementation</code>](#ChartImplementation) | 
| config | [<code>RawConfig</code>](#RawConfig) | 


The first parameter, the `chartImplementation` is a chart object conforming the [chart interface](chart-inteface.md).

The second parameter, the `config` object, has following properties:

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> |  | the tabular data to be represented |
| dataTypes | [<code>DataTypes</code>](#DataTypes) |  | object with data types annotations (column name => type name) |
| mapping | [<code>Mapping</code>](#Mapping) |  | the current mapping of column names to dimensions of the current visual model |
| [visualOptions] | [<code>VisualOptions</code>](#VisualOptions) | <code>{}</code> | visual options values |
| [styles] | <code>Object</code> | <code>{}</code> | css in js styles definitions |



