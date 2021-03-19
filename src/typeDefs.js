/**
 * @typedef DataTypeObject
 * @global
 * @type {object|string}
 * @property {'number'|'string'|'date'} type
 * @property {string} [dateFormat] date format for dates
 * @example
 * { type: 'date', dateFormat: 'DD-MM-YYYY }
 */

/**
 * @typedef DataTypes
 * @global
 * @type {Object.<'number'|'string'|'date'|DataTypeObject>}
 * @example
 * { x: 'number', y: { type: 'date', dateFormat: 'DD-MM-YYYY } }
 */

/**
* @typedef AggregationdDefaultObject
* @global
* @type {object}
* @property {string} [date] default aggregation function for dates
* @property {string} [number] default aggregation function for numbers
* @property {string} [string] default aggregation function for strings
* @example
* {
    number: 'sum',
    string: 'csvDistinct',
    date: 'csvDistinct',
}
*/

/**
 * @typedef Dimension
 * @global
 * @type {object}
 * @property {string} id unique id
 * @property {string} name label
 * @property {boolean} required
 * @property {Boolean} [multiple=false] controls if a dimension accept a value with more than one item
 * @property {number} [minValues=undefined] min number of items required for the value of the dimension
 * @property {number} [maxValues=undefined]  max number of items required for the value of the dimension
 * @property {Array} validTypes valid data types for the dimension (one or more of 'number', 'string', 'date', 'boolean')
 * @property {Boolean} [aggregation] true if a dimension will be aggregated
 * @property {string|AggregationdDefaultObject} [aggregationDefault] default for aggregation
 * @example
 * {
    id: 'size',
    name: 'Size',
    validTypes: ['number'],
    required: false,
    aggregation: true,
    aggregationDefault: 'sum',
  }
 */

/**
 * @typedef DimensionsDefinition
 * @description An array of dimensions, used to describe dimensions of a chart
 * @global
 * @type {Array.<Dimension>}
 * @example
 * [
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
 */

/**
 * @typedef MappedConfigValue
 * @global
 * @type {object}
 * @property {string|Array.<string>} aggregation aggregation(s) function name(s)
 */

/**
 * @typedef MappedDimension
 * @global
 * @type {object}
 * @property {string|Array.<string>} value the mapping value
 * @property {MappedConfigValue} [config] the optional config
 */

/**
 * @typedef Mapping
 * @global
 * @type {Object.<MappedDimension>}
 */

/**
 * @typedef VisualOptionDefinition
 * @global
 * @type {object}
 * @property {'number'|'boolean'|'text'|'colorScale'} type type of option
 * @property {string} label the option label
 * @property {any} default the default value for the option. should match the option type
 * @property {string} [group] the name of the options panel
 * @property {object} [disabled] cross-conditions disabling the option
 * @property {Array.<string>} [requiredDimensions] dimensions that must have a value in mapping for enabling the option
 * @property {string} [container] container node property reference
 * @property {object} [containerCondition] conditions for applying container node property reference
 * 
 * @example
 * {
    type: 'number',
    label: 'Maximum radius',
    default: 20,
    group: 'chart',
  }
 * @example
 {
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard',
  }

*/

/**
 * @typedef VisualOptionsDefinition
 * @global
 * @type {Object.<VisualOptionDefinition>}
 * @example
 * {
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
 */

/**
 * @typedef VisualOptions
 * @global
 * @type {Object}
 * @example
 * { with: 100, showLegend: true }
 */

/**
 * @typedef MappingFunction
 * @global
 * @type {function}
 * @param {array} dataset the input dataset
 * @param {Mapping} mapping the mapping object
 * @param {DataTypes} dataTypes
 * @param {DimensionsDefinition} dimensions the chart dimensions
 */

/**
 * @typedef RenderFunction
 * @global
 * @type {function}
 * @param {Node} node an empty DOMNode that conforms to the `type` exposed by the chart implementation.
 * @param {any} data the data output from the mapData function defined in the cart
 * @param {object} visualOptions the current values of the chart visual options
 * @param {object} mapping the mapping from column names to chart dimensions
 * @param {array} originalData the original tabular dataset
 * @param {styles} Object css in js styles definitions, defined by the chart itself and possibly overridden when the chart instance is created.
 */

/**
 * @typedef ChartMetadata
 * @global
 * @type {object}
 * @property {string} id An unique id for the chart
 * @property {string} name The chart name
 * @property {string} description The chart description
 * @property {Array.<string>} categories The list of chart categories
 * @property {string} icon url or base64 representation of chart icon (will be used as `src` attribute of an `<img>` tag)
 * @property {string} thumbnail url or base64 representation of chart thumbnail (will be used as `src` attribute of an `<img>` tag)
 * @example
 * {
  name: 'Bumpchart',
  id: 'rawgraphs.bumpchart',
  thumbnail: 'data:image/svg+xml;base64...',
  icon: 'data:image/svg+xml;base64...',
  categories: ['correlations', 'proportions'],
  description:
    'It allows the comparison on multiple categories over a continuous dimension and the evolution of its sorting. By default, sorting is based on the stream size.',
}
 */

/**
 * @typedef ChartImplementation
 * @global
 * @type {object}
 * @property {'svg'|'canvas'|div} [type='svg'] the chart type (defaults to svg)
 * @property {ChartMetadata} metadata the chart metadata
 * @property {RenderFunction} render the render function
 * @property {Boolean} [skipMapping=false] if set to true will skip the mapping phase (current mapping is still passed to the render function)
 * @property {MappingFunction} mapData the mapping function
 * @property {DimensionsDefinition} dimensions the dimensions configuration (mapping definition)
 * @property {VisualOptionsDefinition} visualOptions the visual options exposed by the model
 * @property {Object} [styles={}] - css in js styles definitions
 */

/**
 * @typedef RawConfig
 * @global
 * @type {object}
 * @property {Array.<Object>} data - the tabular data to be represented
 * @property {DataTypes} [dataTypes] - object with data types annotations (column name => type name). if not passed will be inferred with the `inferTypes` function
 * @property {Mapping} mapping - the current mapping of column names to dimensions of the current visual model
 * @property {VisualOptions} [visualOptions={}] - visual options values
 * @property {Object} [styles={}] - css in js styles definitions
 */


/**
 * @typedef ParsingOptions
 * @global
 * @type {object}
 * @property {boolean} strict if strict is false, a JSON parsing of the values is tried. (if strict=false: "true" -> true)
 * @property {string} locale
 * @property {string} decimal
 * @property {string} group
 * @property {Array.<string>} numerals
 * @property {string} dateLocale
 */

/**
 * @typedef ParserResult
 * @global
 * @type {object}
 * @property {Array} dataset parsed dataset (list of objects)
 * @property {Object} dataTypes dataTypes used for parsing dataset
 * @property {Array} errors list of errors from parsing
 */

//
//  * @property {'get'| 'group'|'groups'|'rollup'|'rollup-leaf'|'rollups'|'groupAggregate'|'groupBy'|'proxy'} operation the operation type (used for declarative mapping)
//  * @property {Object} targets  only for proxy operations
