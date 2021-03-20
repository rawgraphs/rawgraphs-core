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
    * [new Chart(chartImplementation, data, dataTypes, mapping, visualOptions, styles)](#new_Chart_new)
    * [.data(nextData)](#Chart+data) ⇒ [<code>Chart</code>](#Chart)
    * [.dataTypes(nextDataTypes)](#Chart+dataTypes) ⇒ [<code>Chart</code>](#Chart)
    * [.mapping(nextMapping)](#Chart+mapping) ⇒ [<code>Chart</code>](#Chart)
    * [.visualOptions(nextVisualOptions)](#Chart+visualOptions) ⇒ [<code>Chart</code>](#Chart)
    * [.styles(Object)](#Chart+styles) ⇒ [<code>Chart</code>](#Chart)
    * [.renderToDOM(node, (array|object))](#Chart+renderToDOM) ⇒ [<code>DOMChart</code>](#DOMChart)
    * [.renderToString(document, (array|object))](#Chart+renderToString) ⇒ <code>string</code>

<a name="new_Chart_new"></a>

### new Chart(chartImplementation, data, dataTypes, mapping, visualOptions, styles)
Internal class used to represent a visual model with its actual configuration of data, dataTypes, mapping, visualOptions and styles.


| Param | Type | Description |
| --- | --- | --- |
| chartImplementation | [<code>ChartImplementation</code>](#ChartImplementation) | chart implementation |
| data | <code>Array.&lt;Object&gt;</code> |  |
| dataTypes | [<code>DataTypes</code>](#DataTypes) |  |
| mapping | [<code>Mapping</code>](#Mapping) |  |
| visualOptions | [<code>VisualOptions</code>](#VisualOptions) |  |
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

<a name="Chart+mapping"></a>

### chart.mapping(nextMapping) ⇒ [<code>Chart</code>](#Chart)
Sets or updates mapping and returns a new Chart instance.

**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type |
| --- | --- |
| nextMapping | [<code>Mapping</code>](#Mapping) | 

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

### chart.renderToDOM(node, (array|object)) ⇒ [<code>DOMChart</code>](#DOMChart)
**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> |  |
| (array|object) | <code>dataReady</code> | mapped data if available |

<a name="Chart+renderToString"></a>

### chart.renderToString(document, (array|object)) ⇒ <code>string</code>
**Kind**: instance method of [<code>Chart</code>](#Chart)  

| Param | Type | Description |
| --- | --- | --- |
| document | <code>document</code> | HTML document context (optional if window is available) |
| (array|object) | <code>dataReady</code> | mapped data if available |

<a name="DOMChart"></a>

## DOMChart
**Kind**: global class  
<a name="new_DOMChart_new"></a>

### new DOMChart()
Internal class used to represent a Chart instance rendered to a DOM node.
The class has no extra methods for now, but il could be used to provide an "update" functionality in the future.

<a name="colorPresets"></a>

## colorPresets
Color presets objects

**Kind**: global constant  
<a name="scaleTypes"></a>

## scaleTypes
Scale types (names)

**Kind**: global constant  
<a name="baseOptions"></a>

## baseOptions : <code>Object</code>
base options that are injected in all charts and extended by the visualOptions declared by the chart implementation

**Kind**: global constant  
<a name="validators"></a>

## validators
default validators.

**Kind**: global constant  
<a name="getPresetScale"></a>

## getPresetScale(scaleType, domain, interpolator) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - a d3 scale  

| Param | Type |
| --- | --- |
| scaleType | <code>\*</code> | 
| domain | <code>\*</code> | 
| interpolator | <code>\*</code> | 

<a name="getColorDomain"></a>

## getColorDomain(colorDataset, colorDataType, scaleType) ⇒ <code>Array</code>
Extracts the color domain, given a color dataset, a color data type and a scale type
for sequential scales will return 2 points domain (min and max values)
for diverging scales will have 3 points domain (min value, mid value and max value)
for ordinal scales the domain consists of all unique values found in the color dataset

**Kind**: global function  

| Param | Type |
| --- | --- |
| colorDataset | <code>\*</code> | 
| colorDataType | <code>\*</code> | 
| scaleType | <code>\*</code> | 

<a name="getInitialScaleValues"></a>

## getInitialScaleValues(domain, scaleType, interpolator) ⇒ <code>Array.&lt;Object&gt;</code>
Compute the initial ranges and domains, given a domain, a scale type and an interpolator. Used to initialize the values that can be overridden by the user

**Kind**: global function  

| Param | Type |
| --- | --- |
| domain | <code>\*</code> | 
| scaleType | <code>\*</code> | 
| interpolator | <code>\*</code> | 

<a name="getColorScale"></a>

## getColorScale(colorDataset, colorDataType, scaleType, interpolator, userScaleValues) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - The d3 color scale  

| Param | Type | Description |
| --- | --- | --- |
| colorDataset | <code>Array</code> | the array of values of the dataset mapped on the color dimension |
| colorDataType | <code>&#x27;number&#x27;</code> \| <code>&#x27;string&#x27;</code> \| <code>&#x27;date&#x27;</code> \| [<code>DataTypeObject</code>](#DataTypeObject) | the type of the |
| scaleType | <code>string</code> | the name of the scale type used |
| interpolator | <code>string</code> | the name of the interpolator used (must be compatible with scaleType) |
| userScaleValues | <code>Array.&lt;Object&gt;</code> | overrides of ranges/domains points provided by the user |

<a name="getDefaultColorScale"></a>

## getDefaultColorScale(defaultColor) ⇒
**Kind**: global function  
**Returns**: A d3 scale that map any value to the default color.  

| Param | Type |
| --- | --- |
| defaultColor | <code>\*</code> | 

<a name="getAvailableScaleTypes"></a>

## getAvailableScaleTypes(colorDataType, colorDataset) ⇒ <code>Array.&lt;string&gt;</code>
gets the array of names of available scale types, given the color data type and color dataset

**Kind**: global function  

| Param | Type |
| --- | --- |
| colorDataType | <code>\*</code> | 
| colorDataset | <code>\*</code> | 

<a name="inferTypes"></a>

## inferTypes(data, parsingOptions) ⇒ [<code>DataTypes</code>](#DataTypes)
Types guessing

**Kind**: global function  
**Returns**: [<code>DataTypes</code>](#DataTypes) - the types guessed (object with column names as keys and value type as value)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | data to be parsed (list of objects) |
| parsingOptions | <code>parsingOptions</code> |  |

<a name="parseDataset"></a>

## parseDataset(data, [types], [parsingOptions]) ⇒ [<code>ParserResult</code>](#ParserResult)
Dataset parser

**Kind**: global function  
**Returns**: [<code>ParserResult</code>](#ParserResult) - dataset, dataTypes, errors  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | data to be parsed (list of objects) |
| [types] | [<code>DataTypes</code>](#DataTypes) | optional column types |
| [parsingOptions] | [<code>ParsingOptions</code>](#ParsingOptions) | optional parsing options |

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

## chart(chartImplementation, [config]) ⇒ [<code>Chart</code>](#Chart)
This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| chartImplementation | [<code>ChartImplementation</code>](#ChartImplementation) |  |
| [config] | [<code>RawConfig</code>](#RawConfig) | Config object. |

<a name="DataTypeObject"></a>

## DataTypeObject : <code>object</code> \| <code>string</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;number&#x27;</code> \| <code>&#x27;string&#x27;</code> \| <code>&#x27;date&#x27;</code> |  |
| [dateFormat] | <code>string</code> | date format for dates |

**Example**  
```js
{ type: 'date', dateFormat: 'DD-MM-YYYY }
```
<a name="DataTypes"></a>

## DataTypes : <code>Object.&lt;(&#x27;number&#x27;\|&#x27;string&#x27;\|&#x27;date&#x27;\|DataTypeObject)&gt;</code>
**Kind**: global typedef  
**Example**  
```js
{ x: 'number', y: { type: 'date', dateFormat: 'DD-MM-YYYY } }
```
<a name="AggregationdDefaultObject"></a>

## AggregationdDefaultObject : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [date] | <code>string</code> | default aggregation function for dates |
| [number] | <code>string</code> | default aggregation function for numbers |
| [string] | <code>string</code> | default aggregation function for strings |

**Example**  
```js
{
    number: 'sum',
    string: 'csvDistinct',
    date: 'csvDistinct',
}
```
<a name="Dimension"></a>

## Dimension : <code>object</code>
**Kind**: global typedef  
**Properties**

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
| [aggregationDefault] | <code>string</code> \| [<code>AggregationdDefaultObject</code>](#AggregationdDefaultObject) |  | default for aggregation |

**Example**  
```js
{
    id: 'size',
    name: 'Size',
    validTypes: ['number'],
    required: false,
    aggregation: true,
    aggregationDefault: 'sum',
  }
```
<a name="DimensionsDefinition"></a>

## DimensionsDefinition : [<code>Array.&lt;Dimension&gt;</code>](#Dimension)
An array of dimensions, used to describe dimensions of a chart

**Kind**: global typedef  
**Example**  
```js
[
  {
    id: 'steps',
    name: 'Steps',
    validTypes: ['number', 'date', 'string'],
    required: true,
    multiple: true,
    minValues: 2,
  },
  {
    id: 'size',
    name: 'Size',
    validTypes: ['number'],
    required: false,
    aggregation: true,
    aggregationDefault: 'sum',
  },
]
```
<a name="MappedConfigValue"></a>

## MappedConfigValue : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| aggregation | <code>string</code> \| <code>Array.&lt;string&gt;</code> | aggregation(s) function name(s) |

<a name="MappedDimension"></a>

## MappedDimension : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>Array.&lt;string&gt;</code> | the mapping value |
| [config] | [<code>MappedConfigValue</code>](#MappedConfigValue) | the optional config |

<a name="Mapping"></a>

## Mapping : [<code>Object.&lt;MappedDimension&gt;</code>](#MappedDimension)
**Kind**: global typedef  
<a name="VisualOptionDefinition"></a>

## VisualOptionDefinition : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;number&#x27;</code> \| <code>&#x27;boolean&#x27;</code> \| <code>&#x27;text&#x27;</code> \| <code>&#x27;colorScale&#x27;</code> | type of option |
| label | <code>string</code> | the option label |
| default | <code>any</code> | the default value for the option. should match the option type |
| [group] | <code>string</code> | the name of the options panel |
| [disabled] | <code>object</code> | cross-conditions disabling the option |
| [requiredDimensions] | <code>Array.&lt;string&gt;</code> | dimensions that must have a value in mapping for enabling the option |
| [container] | <code>string</code> | container node property reference |
| [containerCondition] | <code>object</code> | conditions for applying container node property reference |

**Example**  
```js
{
    type: 'number',
    label: 'Maximum radius',
    default: 20,
    group: 'chart',
  }
```
**Example**  
```js
{
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard',
  }
```
<a name="VisualOptionsDefinition"></a>

## VisualOptionsDefinition : [<code>Object.&lt;VisualOptionDefinition&gt;</code>](#VisualOptionDefinition)
**Kind**: global typedef  
**Example**  
```js
{
  maxRadius: {
    type: 'number',
    label: 'Maximum radius',
    default: 20,
    group: 'chart',
  },

  showLegend: {
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard',
  },

  legendWidth: {
    type: 'number',
    label: 'Legend width',
    default: 200,
    group: 'artboard',
    disabled: {
      showLegend: false,
    },
    container: 'width',
    containerCondition: {
      showLegend: true,
    },
  },

  layout: {
    type: 'text',
    label: 'Layout algorythm',
    group: 'chart',
    options: ['Cluster Dendogram', 'Tree'],
    default: 'Tree',
  },

  colorScale: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'color',
    default: {
      scaleType: 'ordinal',
      interpolator: 'interpolateSpectral',
    },
    group: 'color',
  }

}
```
<a name="VisualOptions"></a>

## VisualOptions : <code>Object</code>
**Kind**: global typedef  
**Example**  
```js
{ with: 100, showLegend: true }
```
<a name="MappingFunction"></a>

## MappingFunction : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| dataset | <code>array</code> | the input dataset |
| mapping | [<code>Mapping</code>](#Mapping) | the mapping object |
| dataTypes | [<code>DataTypes</code>](#DataTypes) |  |
| dimensions | [<code>DimensionsDefinition</code>](#DimensionsDefinition) | the chart dimensions |

<a name="RenderFunction"></a>

## RenderFunction : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | an empty DOMNode that conforms to the `type` exposed by the chart implementation. |
| data | <code>any</code> | the data output from the mapData function defined in the cart |
| visualOptions | <code>object</code> | the current values of the chart visual options |
| mapping | <code>object</code> | the mapping from column names to chart dimensions |
| originalData | <code>array</code> | the original tabular dataset |
| Object | <code>styles</code> | css in js styles definitions, defined by the chart itself and possibly overridden when the chart instance is created. |

<a name="ChartMetadata"></a>

## ChartMetadata : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | An unique id for the chart |
| name | <code>string</code> | The chart name |
| description | <code>string</code> | The chart description |
| categories | <code>Array.&lt;string&gt;</code> | The list of chart categories |
| icon | <code>string</code> | url or base64 representation of chart icon (will be used as `src` attribute of an `<img>` tag) |
| thumbnail | <code>string</code> | url or base64 representation of chart thumbnail (will be used as `src` attribute of an `<img>` tag) |

**Example**  
```js
{
  name: 'Bumpchart',
  id: 'rawgraphs.bumpchart',
  thumbnail: 'data:image/svg+xml;base64...',
  icon: 'data:image/svg+xml;base64...',
  categories: ['correlations', 'proportions'],
  description:
    'It allows the comparison on multiple categories over a continuous dimension and the evolution of its sorting. By default, sorting is based on the stream size.',
}
```
<a name="ChartImplementation"></a>

## ChartImplementation : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [type] | <code>&#x27;svg&#x27;</code> \| <code>&#x27;canvas&#x27;</code> \| <code>div</code> | <code>&#x27;svg&#x27;</code> | the chart type (defaults to svg) |
| metadata | [<code>ChartMetadata</code>](#ChartMetadata) |  | the chart metadata |
| render | [<code>RenderFunction</code>](#RenderFunction) |  | the render function |
| [skipMapping] | <code>Boolean</code> | <code>false</code> | if set to true will skip the mapping phase (current mapping is still passed to the render function) |
| mapData | [<code>MappingFunction</code>](#MappingFunction) |  | the mapping function |
| dimensions | [<code>DimensionsDefinition</code>](#DimensionsDefinition) |  | the dimensions configuration (mapping definition) |
| visualOptions | [<code>VisualOptionsDefinition</code>](#VisualOptionsDefinition) |  | the visual options exposed by the model |
| [styles] | <code>Object</code> | <code>{}</code> | css in js styles definitions |

<a name="RawConfig"></a>

## RawConfig : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> |  | the tabular data to be represented |
| [dataTypes] | [<code>DataTypes</code>](#DataTypes) |  | object with data types annotations (column name => type name). if not passed will be inferred with the `inferTypes` function |
| mapping | [<code>Mapping</code>](#Mapping) |  | the current mapping of column names to dimensions of the current visual model |
| [visualOptions] | [<code>VisualOptions</code>](#VisualOptions) | <code>{}</code> | visual options values |
| [styles] | <code>Object</code> | <code>{}</code> | css in js styles definitions |

<a name="ParsingOptions"></a>

## ParsingOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| strict | <code>boolean</code> | if strict is false, a JSON parsing of the values is tried. (if strict=false: "true" -> true) |
| locale | <code>string</code> |  |
| decimal | <code>string</code> |  |
| group | <code>string</code> |  |
| numerals | <code>Array.&lt;string&gt;</code> |  |
| dateLocale | <code>string</code> |  |

<a name="ParserResult"></a>

## ParserResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dataset | <code>Array</code> | parsed dataset (list of objects) |
| dataTypes | <code>Object</code> | dataTypes used for parsing dataset |
| errors | <code>Array</code> | list of errors from parsing |

