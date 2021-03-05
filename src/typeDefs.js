
/**
 * @typedef DataType
 * @global
 * @type {object|string}
 * @property {string} [type]
 * @property {string} [dateFormat]
 */

/**
 * @typedef DataTypes
 * @global
 * @type {object.<DataType>}
 */

/**
 * @typedef Dimension
 * @global
 * @type {object}
 * @property {string} id unique id
 * @property {string} name label
 * @property {boolean} required
 * @property {'get'| 'group'|'groups'|'rollup'|'rollup-leaf'|'rollups'|'groupAggregate'|'groupBy'|'proxy'} operation the operation type
 * @property {Object} targets  only for proxy operations
 * @property {Boolean} [multiple=false] controls if a dimension accept a value with more than one item
 * @property {number} [minValues=undefined] min number of items required for the value of the dimension
 * @property {number} [maxValues=undefined]  max number of items required for the value of the dimension
 * @property {Array} validTypes valid data types for the dimension (one or more of 'number', 'string', 'date', 'boolean')
 * @property {Boolean} [aggregation] true if a dimension will be aggregated
 */

/**
 * @typedef DimensionsDefinition
 * @description An array of dimensions, used to describe dimensions of a chart
 * @global
 * @type {Array.<Dimension>}
 */

/**
 * @typedef MappedDimension
 * @global
 * @type {object}
 */

/**
 * @typedef Mapping
 * @global
 * @type {object}
 */

/**
 * @typedef VisualOption
 * @global
 * @type {object}
 */

/**
 * @typedef VisualOptions
 * @global
 * @type {Object.<VisualOption>}
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
 * @param {Node} node
 * @param {any} data the data from mapping
 * @param {object} visualOptions the chart visual options
 * @param {object} mapping the mapping from column names to
 * @param {array} originalData the original tabular dataset
 * @param {styles} Object -- css in js styles definitions
 */

 /**
 * @typedef ChartMetadata
 * @global
 * @type {object}
 * @property {string} id An unique id for the chart
 * @property {string} name The chart name
 * @property {string} description The chart description
 * @property {Array.<string>} categories The list of chart categories
 * @property {string} icon base64 representation of chart icon
 * @property {string} thumbnail base64 representation of chart thumbnail
 */

/**
 * @typedef VisualModel
 * @global
 * @type {object}
 * @property {'svg'|'canvas'|div} [type='svg'] the chart type (defaults to svg)
 * @property {ChartMetadata} metadata the chart metadata
 * @property {RenderFunction} render the render function
 * @property {DimensionsDefinition} dimensions the dimensions configuration (mapping definition)
 * @property {VisualOptions} visualOptions the visual options exposed by the model
 * @property {Boolean} [skipMapping=false] if set to true will skip the mapping phase (current mapping is still passed to the render function)
 * @property {Object} [styles={}] -- css in js styles definitions
 */

/**
 * @typedef RawConfig
 * @global
 * @type {object}
 * @property {Array.<Object>} data - the tabular data to be represented
 * @property {DataTypes} dataTypes - object with data types annotations (column name => type name)
 * @property {Mapping} mapping - the current mapping of column names to dimensions of the current visual model
 * @property {VisualOptions} [visualOptions={}] - visual options
 * @property {Object} [styles={}] -- css in js styles definitions
 */