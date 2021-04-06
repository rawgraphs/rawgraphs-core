---
id: chart-interface
title: Chart interface
sidebar_label: Chart interface
slug: /chart-interface
---


To display a chart with rawgraphs we need to provide an implementation of the rawgraphs **chart-interface**.
In this page we'll describe this interface and provide an example of implementing a simple chart.

Each chart implementation is defined by a javascript object, with some properties that are used to:

- describe the chart with some metadata (title, description, an unique id, thumbnail and icon)
- define the semantics of the visual model (dimensions)
- define how to transform a tabular dataset based on a "mapping" between the dimensions and data columns in the dataset
- expose a set of visual options
- define how to render the processed data to an HTML DOM node.

A **chart implementation** object must have the following properties:


| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [type] | <code>'svg'</code> \| <code>'canvas'</code> \| <code>'div'</code> | <code>svg</code> | the chart type (defaults to svg) |
| metadata | [<code>ChartMetadata</code>](api#chartmetadata--object) |  | the chart metadata |
| dimensions | [<code>DimensionsDefinition</code>](api#dimensionsdefinition--codearraydimensioncode) |  | the dimensions configuration (mapping definition) |
| [skipMapping] | <code>Boolean</code> | <code>false</code> | if set to true will skip the mapping phase (current mapping is still passed to the render function) |
| mapData | [<code>MappingFunction</code>](api#mappingfunction--function) |  | the mapping function |
| visualOptions | [<code>VisualOptionsDefinition</code>](api#visualoptionsdefinition--codeobjectvisualoptiondefinitioncode) |  | the visual options exposed by the model |
| render | [<code>RenderFunction</code>](api#renderfunction--function) |  | the render function |
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
An object with some additional properties describing the chart. Metadata is used to populate the graphic interface of [rawgraphs-app](https://github.com/rawgraphs/rawgraphs-app).

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | An unique id for the chart |
| name | <code>string</code> | The chart name |
| description | <code>string</code> | The chart description |
| categories | <code>Array.\<string\></code> | The list of chart categories |
| icon | <code>string</code> | url or base64 representation of chart icon (will be used as `src` attribute of an `<img>` tag) |
| thumbnail | <code>string</code> | url or base64 representation of chart thumbnail (will be used as `src` attribute of an `<img>` tag) |



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

The dimension property must be an array of [Dimension definitions](api#dimension--object) and is used to create the "slots" to whom can be mapped the columns of the user dataset. 
Each dimension is an object with the following properties:


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


In our "XYPlot" example we will be able to encode 4 dimensions: the x and y on the cartesian plane, the size (radius) of each bubble, and the label shown.
In our example the user will have to map each of these dimension to single a data column (all dimensions are required).
Let's add the dimensions property to our chart definition:


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

This property must contain a function that will be used to transform data from the user dataset, which is always a tabular format, into a new object, suitable for rendering data. The result of this function, the **mapped** dataset, will be passed to the `render` function, described later in this document.

The transformation has different purposes:

- Simplyfing data before rendering: for example the unused columns of the dataset can be removed before passing data to render
- Translating the names of the properties of each data point from column names to the chart semantics (dimensions). This operation is based on the "mapping" provided by the user and simplifies the rendering step, as variable names are always known (while name of columns change each time the user changes dataset).
- Preparing the data in a shape that easier to use to perform the chart rendering. 

The separation of data mapping from the actual rendering also reflects the workflow of the rawgraphs app and helps to optimize the process: once a dataset is mapped, we can "tweak" the visual options of the chart without performing all data transformations each time we try a new option. 
The render function will still be able to apply more transformations to the dataset and also access the initial data provided by the user.

The `mapData` function is expected to have the following signature:

**mapData(dataset, mapping, dataTypes, dimensions)**

Where the parameters are the following:

| Param | Type | Description |
| --- | --- | --- |
| dataset | <code>array</code> | the input dataset |
| mapping | [<code>Mapping</code>](api#mapping--codeobjectmappeddimensioncode) | the mapping object |
| dataTypes | [<code>DataTypes</code>](api#datatypes--objectnumberstringdatedatatypeobject) |  |
| dimensions | [<code>DimensionsDefinition</code>](api#dimensionsdefinition--codearraydimensioncode) | the chart dimensions |


In our case, since we need just to pull out the needed columns and rename them according to dimensions, the mapData function can be implemented as follows:


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

:::info
Rawgraphs also has a concept of "declarative mapping" that allows to specify a `mapData` in a declarative way, without writing a function. This feature is still under development, but it's already used, in its simplest form, for some charts in the [rawgraphs-charts](https://github.com/rawgraphs/rawgraphs-charts) repository, for example the [bubble chart](https://github.com/rawgraphs/rawgraphs-charts/tree/master/src/bubblechart).
See the section about [declarative mapping](declarative-mapping.md) for more info.
:::

## `visualOptions` 

This property exposes the options that are available to change the visual appeareance of the chart once the dataset has been mapped.
It must be an object, with keys representing the variables that will be available into the render function and values representing the configuration: type of option and a default value, and a label to be used to show the option in the rawgraphs-app.

The configuration also accepts more options, for handling deactivation of visual options in certain cases. 
The optional `disabled` property of each visual option is an object that may be used to specify a condition to disable the option, given the values of other options.
The optional `requiredDimensions` property of each visual option, gives the possibility to enable a certain option only if the specified dimensions ids have been provided by the current mapping specified by the user. 

This is the complete list of property supported by visual options configuration:


| Name | Type | Description |
| --- | --- | --- |
| type | <code>'number'</code> \| <code>'boolean'</code> \| <code>'text'</code> \| <code>'colorScale'</code> | type of option |
| label | <code>string</code> | the option label |
| default | <code>any</code> | the default value for the option. should match the option type |
| [group] | <code>string</code> | the name of the options panel |
| [disabled] | <code>object</code> | cross-conditions disabling the option |
| [requiredDimensions] | <code>Array.&lt;string&gt;</code> | dimensions that must have a value in mapping for enabling the option |
| [container] | <code>string</code> | container node property reference |
| [containerCondition] | <code>object</code> | conditions for applying container node property reference |



In our example, we'll add a set of visual options to control:

- the max radius of the bubbles
- wether to show the stroke of the bubbles
- the color of the stroke
- the color for the fill
- the color for the labels

Here is our visualOptions definition:


```js
const XYPlot = {
  ...
  visualOptions: {
    maxRadius: {
      label: "Max radius",
      type: "number",
      default: 10,
      min: 2
    },
    showStroke: {
      label: "Show stroke",
      type: "boolean",
      default: true
    },
    stroke: {
      label: "Stroke color",
      type: "color",
      default: "red"
    },
    fill: {
      label: "Fill color",
      type: "color",
      default: "red"
    },
    labelsColor: {
      label: "Labels color",
      type: "color",
      default: "hotpink"
    }
  },
  ...
}
```


## `render` 

The `render` property is a function that takes care of performing the final rendering of the chart into a DOM node. This is where the visual model is finally implemented.
The function has the following signature:

**render(node, data, visualOptions, mapping, originalData, styles)**

and has no return value. The parameters have the following roles:

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | an empty DOMNode that conforms to the `type` exposed by the chart implementation. |
| data | <code>any</code> | the data output from the mapData function defined in the cart |
| visualOptions | <code>object</code> | the current values of the chart visual options |
| mapping | <code>object</code> | the mapping from column names to chart dimensions |
| originalData | <code>array</code> | the original tabular dataset |
| Object | <code>styles</code> | css in js styles definitions, defined by the chart itself and possibly overridden when the chart instance is created. |


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
