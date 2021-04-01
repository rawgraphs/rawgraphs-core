---
id: core
title: rawgraphs-core
sidebar_label: rawgraphs-core
slug: /
---

Welcome to the rawgraphs-core documentation!

This library was born to simplify and modularize development of the [RawGraphs web app](https://app.rawgraphs.io), but it can be used to implement the RAWGraphs workflow and rendering charts from javascript code.

The library roughly contains:

- functions for rendering a visual model and a dataset to the DOM, just like the RawGraphs web app works
- helper functions used for the various subtasks of the workflow like data parsing, aggregation, visual options encoding/decoding, etc.
- utility functions that can be used in visual models implementations (ex: legends)


Please refer to the [workflow](workflow.md) description for more details about the relations between this library and the actual visual models, and to [chart interface](chart-interface.md) for more info about how to create your custom charts that can be used with rawgraphs-core and with the RAWGraphs app.

