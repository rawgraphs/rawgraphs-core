---
id: glossary
title: Glossary
sidebar_label: Glossary
slug: /glossary
---



#### Chart

Charts are implementations in RAWGraphs to create a specific [visual model](#visual-model). They returns the [visualisation](#visualization) (an image, usually an SVG node) that the user can then download.

#### Data column

A column of the input [dataset](#dataset). RAWgraphs requires as input a single plain table. Each column must have a unique header in the first row.

#### Dataset

The data to be visualized. RAWGraphs is able to process tabular datasets, where each row represents a data point and each column a property. Rawgraphs expects headers in the first line.

#### Data type

The kind of data contained in each [column](#data-column) of the [dataset](#dataset). RAWgraphs is able to handle `strings` (texts), `dates` and `numbers`.

#### Dimension

Dimensions are the data inputs required to render a [chart](#chart), allowing the user to choose the appropriate [data column](#data-column) to be passed to the [mapping](#mapping) and to create the data structure needed by the chart.

While often dimensions are directly binded to visual variables (e.g. in a `bubble chart` dimensions are  and  position,  and ), dimensions can have a more complex role in the mapping. For example, they can be used to group data, or to create nested structures as in a `treemap`.

#### Mapping

Each [chart](#chart) requires an appropriate data structure to be rendered.  In short, the mapping transforms [data columns](#data-column) into the 'something else' charts need to work with through the [dimensions](#dimension).

Mapping returns a data table strucuterd as need by the chart.

#### Visual model

The visual result that you want to achieve through a [chart](#chart) implementation. For example, the "bar chart" could be created using different data structures and could feature different [mapping options](#mapping) and as well [visual options](#visual-option).

#### Visual option

Visual features of the [chart](#chart) not related to data, for example the artboard width and height, text style, margins, etc.
An exception are colour scale that are exposed as visual options to enable users to choose their own palette.

#### Visualization

The image rendered by a [chart](#chart).