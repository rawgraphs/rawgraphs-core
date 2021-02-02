---
id: api
title: API
sidebar_label: API
slug: /api
---

<a name="Chart"></a>

## Chart
**Kind**: global class  

* [Chart](#Chart)
    * [new Chart(visualModel, data, dataTypes, mapping, visualOptions, styles)](#new_Chart_new)
    * [.data(nextData)](#Chart+data) ⇒ [<code>Chart</code>](#Chart)
    * [.dataTypes(nextDataTypes)](#Chart+dataTypes) ⇒ [<code>Chart</code>](#Chart)
    * [.visualOptions(nextVisualOptions)](#Chart+visualOptions) ⇒ [<code>Chart</code>](#Chart)
    * [.styles(Object)](#Chart+styles) ⇒ [<code>Chart</code>](#Chart)
    * [.renderToDOM(node)](#Chart+renderToDOM) ⇒ [<code>DOMChart</code>](#DOMChart)
    * [.renderToString(document)](#Chart+renderToString) ⇒ <code>string</code>

<a name="new_Chart_new"></a>

### new Chart(visualModel, data, dataTypes, mapping, visualOptions, styles)
Internal class used to represent a visual model with its actual configuration of data, dataTypes, mapping, visualOptions and styles.


| Param | Type | Description |
| --- | --- | --- |
| visualModel | [<code>VisualModel</code>](#VisualModel) | visual model |
| data | <code>Array.&lt;Object&gt;</code> |  |
| dataTypes | <code>Object</code> |  |
| mapping | <code>Object</code> |  |
| visualOptions | <code>Object</code> |  |
| styles | <code>Object</code> |  |

<a name="Chart+data"></a>

### chart.data(nextData) ⇒ [<code>Chart</code>](#Chart)
Sets or updates new data and returns a new Chart instance.

**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type |
| --- | --- |
| nextData | <code>Array.&lt;Object&gt;</code> | 

<a name="Chart+dataTypes"></a>

### chart.dataTypes(nextDataTypes) ⇒ [<code>Chart</code>](#Chart)
Sets or updates dataTypes and returns a new Chart instance.

**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type |
| --- | --- |
| nextDataTypes | [<code>DataTypes</code>](#DataTypes) | 

<a name="Chart+visualOptions"></a>

### chart.visualOptions(nextVisualOptions) ⇒ [<code>Chart</code>](#Chart)
Sets or updates visual options and returns a new Chart instance.

**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type |
| --- | --- |
| nextVisualOptions | [<code>VisualOptions</code>](#VisualOptions) | 

<a name="Chart+styles"></a>

### chart.styles(Object) ⇒ [<code>Chart</code>](#Chart)
Sets or updates styles and returns a new Chart instance.

**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type |
| --- | --- |
| Object | <code>styles</code> | 

<a name="Chart+renderToDOM"></a>

### chart.renderToDOM(node) ⇒ [<code>DOMChart</code>](#DOMChart)
**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 

<a name="Chart+renderToString"></a>

### chart.renderToString(document) ⇒ <code>string</code>
**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type | Description |
| --- | --- | --- |
| document | <code>document</code> | HTML document context (optional if window is available) |

<a name="DOMChart"></a>

## DOMChart
**Kind**: global class  
<a name="new_DOMChart_new"></a>

### new DOMChart()
Internal class used to represent a Chart instance rendered to a DOM node.

<a name="validators"></a>

## validators
default validators.
#TODO: registration approach?

**Kind**: global constant  
<a name="inferTypes"></a>

## inferTypes(data, strict) ⇒ <code>object</code>
Types guessing

**Kind**: global function  
**Returns**: <code>object</code> - the types guessed (object with column names as keys and value type as value)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | data to be parsed (list of objects) |
| strict | <code>boolean</code> | if strict is false, a JSON parsing of the values is tried. (if strict=false: "true" -> true) |

<a name="parseDataset"></a>

## parseDataset(data, types) ⇒ [<code>ParserResult</code>](#ParserResult)
Dataset parser

**Kind**: global function  
**Returns**: [<code>ParserResult</code>](#ParserResult) - dataset, dataTypes, errors  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | data to be parsed (list of objects) |
| types | <code>object</code> | optional column types |

<a name="validateMapperDefinition"></a>

## validateMapperDefinition(dimensions)
dimensions validator

**Kind**: global function  

| Param | Type |
| --- | --- |
| dimensions | <code>array</code> | 

<a name="validateMapping"></a>

## validateMapping(mapper, mapping, types)
mapping validator

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mapper | <code>array</code> | definition |
| mapping | <code>object</code> | configuration |
| types | <code>object</code> | column datatypes |

<a name="makeMapper"></a>

## makeMapper(dimensions, mapping, types) ⇒ <code>function</code>
mapper generator

**Kind**: global function  
**Returns**: <code>function</code> - the mapper function  

| Param | Type | Description |
| --- | --- | --- |
| dimensions | <code>array</code> | mapper definition |
| mapping | <code>object</code> | mapping configuration |
| types | <code>types</code> | column types |

<a name="checkPredicates"></a>

## checkPredicates(conditionObject, values)
Helper function for checking predicates, used in getEnabledOptions

**Kind**: global function  

| Param | Type |
| --- | --- |
| conditionObject | <code>\*</code> | 
| values | <code>\*</code> | 

<a name="validateOptions"></a>

## validateOptions(optionsConfig, optionsValues)
options validation and deserialization

**Kind**: global function  

| Param | Type |
| --- | --- |
| optionsConfig | <code>object</code> | 
| optionsValues | <code>object</code> | 

<a name="chart"></a>

## chart(visualModel, config) ⇒ [<code>Chart</code>](#Chart)
This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class

**Kind**: global function  

| Param | Type |
| --- | --- |
| visualModel | [<code>VisualModel</code>](#VisualModel) | 
| config | [<code>RawConfig</code>](#RawConfig) | 

<a name="ParserResult"></a>

## ParserResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dataset | <code>Array</code> | parsed dataset (list of objects) |
| dataTypes | <code>Object</code> | dataTypes used for parsing dataset |
| errors | <code>Array</code> | list of errors from parsing |

<a name="DataTypes"></a>

## DataTypes : <code>object</code>
**Kind**: global typedef  
<a name="Dimension"></a>

## Dimension : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | unique id |
| name | <code>string</code> |  | label |
| required | <code>boolean</code> |  |  |
| operation | <code>&#x27;get&#x27;</code> \| <code>&#x27;group&#x27;</code> \| <code>&#x27;groups&#x27;</code> \| <code>&#x27;rollup&#x27;</code> \| <code>&#x27;rollup-leaf&#x27;</code> \| <code>&#x27;rollups&#x27;</code> \| <code>&#x27;groupAggregate&#x27;</code> \| <code>&#x27;groupBy&#x27;</code> \| <code>&#x27;proxy&#x27;</code> |  | the operation type |
| targets | <code>Object</code> |  | only for proxy operations |
| [multiple] | <code>Boolean</code> | <code>false</code> | controls if a dimension accept a value with more than one item |
| [minValues] | <code>number</code> |  | min number of items required for the value of the dimension |
| [maxValues] | <code>number</code> |  | max number of items required for the value of the dimension |
| validTypes | <code>Array</code> |  | valid data types for the dimension (one or more of 'number', 'string', 'date', 'boolean') |
| [aggregation] | <code>Boolean</code> |  | true if a dimension will be aggregated |

<a name="MappingDefinition"></a>

## MappingDefinition : [<code>Array.&lt;Dimension&gt;</code>](#Dimension)
**Kind**: global typedef  
<a name="MappedDimension"></a>

## MappedDimension : <code>object</code>
**Kind**: global typedef  
<a name="Mapping"></a>

## Mapping : <code>object</code>
**Kind**: global typedef  
<a name="VisualOption"></a>

## VisualOption : <code>object</code>
**Kind**: global typedef  
<a name="VisualOptionsDefinition"></a>

## VisualOptionsDefinition : [<code>Array.&lt;VisualOption&gt;</code>](#VisualOption)
**Kind**: global typedef  
<a name="VisualOptions"></a>

## VisualOptions : <code>object</code>
**Kind**: global typedef  
<a name="RenderFunction"></a>

## RenderFunction : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> |  |
| data | <code>any</code> | the data from mapping |
| visualOptions | <code>object</code> | the chart visual options |
| mapping | <code>object</code> | the mapping from column names to |
| originalData | <code>array</code> | the original tabular dataset |

<a name="VisualModel"></a>

## VisualModel : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| render | [<code>RenderFunction</code>](#RenderFunction) |  | the render function |
| dimensions | [<code>MappingDefinition</code>](#MappingDefinition) |  | the dimensions configuration (mapping definition) |
| options | [<code>VisualOptionsDefinition</code>](#VisualOptionsDefinition) |  | the visual options exposed by the model |
| [skipMapping] | <code>Boolean</code> | <code>false</code> | if set to true will skip the mapping phase (current mapping is still passed to the render function) |

<a name="RawConfig"></a>

## RawConfig : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> | the tabular data to be represented |
| dataTypes | [<code>DataTypes</code>](#DataTypes) | object with data types annotations (column name => type name) |
| mapping | [<code>Mapping</code>](#Mapping) | the current mapping of column names to dimensions of the current visual model |
| visualOptions | [<code>VisualOptions</code>](#VisualOptions) | visual options |

