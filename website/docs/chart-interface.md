---
id: chart-interface
title: Chart interface
sidebar_label: Chart interface
slug: /chart-interface
---


To display a chart with rawgraphs we need to implement an object conforming the chart-interface.
In this page we'll describe this interface and provide an example of implementing a simple chart.

Each chart implementation consist of a javascript object, with some properties that are used to:

- describe the chart with some metadata (title, description, an unique id, thumbnail and icon)
- define the semantics of the visual model (dimensions)
- define how to transform a tabular dataset based on a "mapping" between the dimensions and data columns in the dataset
- expose a set of visual options
- define how to render the processed data to an HTML DOM node.

A **chart implementation** object must have the following properties:


| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [type] | <code>&#x27;svg&#x27;</code> \| <code>&#x27;canvas&#x27;</code> \| <code>div</code> | <code>&#x27;svg&#x27;</code> | the chart type (defaults to svg) |
| metadata | [<code>ChartMetadata</code>](#ChartMetadata) |  | the chart metadata |
| dimensions | [<code>DimensionsDefinition</code>](#DimensionsDefinition) |  | the dimensions configuration (mapping definition) |
| [skipMapping] | <code>Boolean</code> | <code>false</code> | if set to true will skip the mapping phase (current mapping is still passed to the render function) |
| mapData | [<code>MappingFunction</code>](#MappingFunction) |  | the mapping function |
| visualOptions | [<code>VisualOptionsDefinition</code>](#VisualOptionsDefinition) |  | the visual options exposed by the model |
| render | [<code>RenderFunction</code>](#RenderFunction) |  | the render function |
| [styles] | <code>Object</code> | <code>{}</code> | css in js styles definitions |


As an example, we'll build a simple chart that will plot "bubbles" on an xy plane, a simplified version of the bubble chart you can find in the RAWGraphs app.
We'll call it "XYPlot":


```js
const XYPlot = {
    type: 'svg',
    metadata: {...},
    dimensions: [...],
    mapData: function(...){},
    render: function(...){},
    visualOptions: {...},
    styles: {...},
}
```

The meaning and shape of each property are detailed in the following sections.

:::info
Take a look at the [rawgraphs-charts](https://github.com/rawgraphs/rawgraphs-charts) for real example of charts implementations
:::


## `type`
A string, that describes the type of DOM node the charts needs as "parent" in the html document. This container node will be provided by the rawgrahps code.
Can be one of `svg` (the default), `canvas` or `div`.

## `metadata`
An object with some additional properties describing the chart.

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | An unique id for the chart |
| name | <code>string</code> | The chart name |
| description | <code>string</code> | The chart description |
| categories | <code>Array.&lt;string&gt;</code> | The list of chart categories |
| icon | <code>string</code> | url or base64 representation of chart icon (will be used as `src` attribute of an `<image>` tag) |
| thumbnail | <code>string</code> | url or base64 representation of chart thumbnail (will be used as `src` attribute of an `<image>` tag) |



```js
const XYPlot = {

  metadata: {
    id: "example.xyplot",
    title: "XYPlot",
    description: "An example plot"
  },
  ...
}

```

## `dimensions`

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | unique id |
| name | <code>string</code> |  | label |
| required | <code>boolean</code> |  |  |
| [multiple] | <code>Boolean</code> | <code>false</code> | controls if a dimension accept a value with more than one item |
| [minValues] | <code>number</code> |  | min number of items required for the value of the dimension |
| [maxValues] | <code>number</code> |  | max number of items required for the value of the dimension |
| validTypes | <code>Array</code> |  | valid data types for the dimension (one or more of 'number', 'string', 'date', 'boolean') |
| [aggregation] | <code>Boolean</code> |  | true if a dimension will be aggregated |
| [aggregationDefault] | <code>string</code> \| [<code>AggregationdDefaultObject</code>](api#aggregationddefaultobject--object) |  | default for aggregation |


```js
const XYPlot = {
  ...
  dimensions: [
    {
      id: "x",
      name: "X Axis",
      validTypes: ["number"],
      required: true
    },
    {
      id: "y",
      name: "Y Axis",
      validTypes: ["number"],
      required: true
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: false
    },
    {
      id: "label",
      name: "Label",
      required: true
    }
  ],
  ...
}
```

## `skipMapping` 

A boolean proerty (default is `false`). If set to `true` will skip involking the `mapData` function and pass the dataset directly to the `render` function.
In our example we'll define a `mapData` function, so this property will not be defined.

## `mapData` 


```js
const XYPlot = {
  ...
  mapData: function (data, mapping, dataTypes, dimensions) {
    return data.map((item) => ({
      x: item[mapping.x.value],
      y: item[mapping.y.value],
      size: mapping.size.value ? item[mapping.size.value] : null,
      label: item[mapping.label.value]
    }));
  },
  ...
}
```

## `visualOptions` 


```js
const XYPlot = {
  ...
  visualOptions: {
    maxRadius: {
      type: "number",
      default: 10,
      min: 2
    },
    showStroke: {
      type: "boolean",
      default: true
    },
    stroke: {
      type: "color",
      default: "red"
    },
    fill: {
      type: "color",
      default: "red"
    },
    labelsColor: {
      type: "color",
      default: "hotpink"
    }
  },
  ...
}
```


## `render` 


```js
const XYPlot = {
  ...
  render: function (
    svgNode,
    data,
    visualOptions,
    mapping,
    originalData,
    styles
  ) {
    const {
      width,
      height,
      background,
      maxRadius,
      showStroke,
      stroke,
      fill,
      labelsColor
    } = visualOptions;
    const margin = {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    };

    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
    const xExtent = d3.extent(data, (item) => item.x);
    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([0, chartWidth])
      .nice();

    const yExtent = d3.extent(data, (item) => item.y);
    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([chartHeight, 0])
      .nice();

    let sizeScale;
    if (mapping.size.value) {
      sizeScale = d3
        .scaleLinear()
        .range([2, maxRadius])
        .domain(d3.extent(data, (item) => item.size));
    }

    const artboardBackground = d3
      .select(svgNode)
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", background)
      .attr("id", "background");

    const svg = d3
      .select(svgNode)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "visualization");

    const vizLayer = svg.append("g").attr("id", "viz");

    const bubbles = vizLayer.selectAll("g").data(data).join("g");

    bubbles
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => {
        return mapping.size.value ? sizeScale(d.size) : maxRadius;
      })
      .attr("fill", fill)
      .attr("stroke", showStroke ? stroke : "none");

    const labelsLayer = svg.append("g").attr("id", "labels");

    labelsLayer
      .selectAll("g")
      .data(mapping.label.value ? data : [])
      .join("g")
      .attr("transform", (d) => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .append("text")
      .text((d) => d.label)
      .attr("x", 0)
      .attr("y", maxRadius + 6)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .style("fill", labelsColor);

    labelsLayer.selectAll("text").call((sel) => {
      return sel.attr("transform", function (d) {
        const height = sel.node().getBBox().height;
        return `translate(0,${-height / 2})`;
      });
    });
  }
  ...
}
```


## `styles`

An object specyfing css-in-js styles that can be used in render.
This is an advanced api that can be used if you want to reuse common styles between various charts or
you want to override some css class defined by the chart when you use it.

We won't use this property in our example.



# Using the chart - live demo

Here's a live demo of our custom chart running in codesandbox. Click on the "Open Sandbox" link to view the full code of our example.


<iframe src="https://codesandbox.io/embed/rawgraphs-custom-chart-1g8oj?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style={{
    width: '100%',
    height: 700,
    border: 0,
  }}
  title="rawgraphs at a glance"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
