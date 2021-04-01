---
id: workflow
title: Workflow
sidebar_label: Workflow
slug: /workflow
---

RAWGraphs solves the generic problem of visualizing data with a modular approach, separating common operations, like parsing data or exporting a visualization to svg, from more specific ones related to the visual model we're going to render.

:::info
In this documentation we will use a glossary wich [you can consult here](glossary). In particular we will use [**"visual model"**](glossary#visual-model) to define the kind of visual result we want to achieve, [**"chart"**](glossary#chart) as the code implementation to realise a visual model, and [**"visualization"**](glossary#visualization) to define the rendered image.
:::

The process of creating a visualization in the [rawgraphs-app](https://github.com/rawgraphs/rawgraphs-app) is broken down into these steps:

1. **data loading**
2. **visual model** selection
3. **mapping** of data variables to the visual model semantics
4. **customization** of the visual options provided by the specific model
5. **export** to open vector (svg) and raster (png, jpg) formats for refining outside RAWGraphs

The [rawgraphs-core](https://github.com/rawgraphs/rawgraphs-core) (this library) provides a set of utilites to implement steps 1, 2, and 5, and for orchestrating the process.

The other parts of the workflow, the ones that depend on the specific visual model, are abstracted by a **chart interface**,
that must be implemented by each visual model in order to be "hooked" into the process.

Each chart implementation is delegated for:

- defining the semantics of the visual model (dimensions)
- transforming a tabular dataset based on a "mapping" between the dimensions and data columns in the dataset
- describing a set of visual options
- implement the actual rendering in a HTML DOM node.

The [chart interface page](chart-interface.md) describes in detail the API that can be used to create charts.

The set of charts implementations used in the official RAWGraphs app can be found the [rawgraphs-charts](https://github.com/rawgraphs/rawgraphs-charts) repository.

:::info
The chart interface intentionally splits the task of rendering a set of data to a document, in order to be plugged into the 
rawgrahps-app, that provides an user interface to control the process, encouraging an explorative approach.
:::








