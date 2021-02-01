---
id: core
title: rawgraphs-core
sidebar_label: rawgraphs-core
slug: /
---

Welcome to the rawgraphs-core documentation!

This library was born simplify and modularize development of the RawGraphs web app, but it can be used to implement the RawGraphs workflow and charts from javascript code.

The library roughly contains:

- a factory function used to render a visual model and a dataset to the DOM, just like the RawGraphs web app works
- helper functions used for the various subtasks of the workflow like data parsing, aggregation, visual options encoding/decoding, etc.
- utility functions that can be used in visual models implementations (ex: legends)


Please refer to the [architecture](architecture.md) description for more details about the relations between this library and the actual visual models, and to [visual models](visual-model.md) for more info about the visual model protocol and how to create your custom charts that can be used with rawgraphs-core and with the RawGraphs app.

