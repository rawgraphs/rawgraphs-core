---
id: rendering
title: Rendering charts
sidebar_label: Rendering charts
slug: /rendering
---

In rawgraphs-core, high level operations, such as chart rendering, are implemented the `Chart` class.

To get an instance of this class, we provide the `chart` factory function.


## chart(visualModel, config) ⇒ [<code>Chart</code>](#Chart)
This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class

**Parameters**

| Param | Type |
| --- | --- |
| visualModel | <code>VisualModel</code> | 
| config | [<code>RawConfig</code>](#RawConfig) | 


The second parameter, the `config` object, has following structure:

### RawConfig : <code>object</code>
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> |  | the tabular data to be represented |
| dataTypes | [<code>DataTypes</code>](#DataTypes) |  | object with data types annotations (column name => type name) |
| mapping | [<code>Mapping</code>](#Mapping) |  | the current mapping of column names to dimensions of the current visual model |
| [visualOptions] | [<code>VisualOptions</code>](#VisualOptions) | <code>{}</code> | visual options |
| [styles] | <code>Object</code> | <code>{}</code> | css in js styles definitions |



```js
import { chart } from 'rawgraphs-core'
import { bubblechart } from 'rawgraphs-charts'

const targetNode = document.getElementByID('some-div')
const viz = new chart(bubblechart)



```
