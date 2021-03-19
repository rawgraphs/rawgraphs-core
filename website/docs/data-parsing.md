---
id: data-parsing
title: Data parsing
sidebar_label: Data parsing
slug: /data-parsing
---

User data is the entry point of the RAWGraphs workflow, and the rawgraphs-core library introduces some concepts and utilities
to deal with user provided datasets.

RAWGraphs works on a tabular dataset, that will be transformed internally according to the chart type we want to draw.

The task of importing such kind of dataset from common formats like csv into javascript is already solved by other libraries
(we use [d3-dsv](https://github.com/d3/d3-dsv) in the RAWGraphs app), but as we normally work with text-based data formats,
we also must define the data types of the different columns.

For example in this csv dataset:

```csv
year, orders, total, client
2000, 100, 1000, A and Co.
2001, 10, 2000, M and Co.
2002, 30, 300, C and Co.
```

all data points and values are formally strings, but the column `year` could be paresed as a date, and the columns `orders` and `total`
are numbers.

## Data Types in RAWGraphs

RAWGraphs has the concept of **data type** and can handle **strings**, **number** and **dates**.

When handling a user dataset, it is required that each data column in the tabular dataset has the same data type for all
the data points.

## Data types inference
