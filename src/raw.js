/**
 * charts module.
 * @module charts
 */

import {
  validateMapperDefinition,
  validateMapping,
  annotateMapping,
  default as makeMapper,
} from "./mapping";
import { inferTypes } from "./dataset";
import { RAWError } from "./utils";
import { getOptions, getDefaultOptions } from "./options";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import mapValues from "lodash/mapValues";
import get from "lodash/get";

export const baseOptions = {
  width: {
    type: "number",
    default: 500,
    container : 'width'
  },

  height: {
    type: "number",
    default: 500,
    container : 'height'
  },

  background: {
    type: "color",
    default: "#FFFFFF",
    container : 'background'
  },

  margins: {
    type: "number",
    default: 10,
  },
};

/**
 * @class
 */
class Chart {
  /**
   * @constructor
   * @param {VisualModel} visualModel visual model
   * @param {Array.<Object>} data
   * @param {Object} dataTypes
   * @param {Object} mapping
   * @param {Object} visualOptions
   */
  constructor(visualModel, data, dataTypes, mapping, visualOptions) {
    this._visualModel = visualModel;
    this._data = data;

    if (
      data &&
      (!this._dataTypes ||
        (typeof this._dataType === "object" &&
          Object.keys(this._dataTypes).length))
    ) {
      this._dataTypes = inferTypes(data);
    } else {
      this._dataTypes = dataTypes;
    }

    this._mapping = mapping;
    this._visualOptions = visualOptions;
  }

  /**
   * @param {Array.<Object>} _data
   * @returns {Chart}
   */
  data(_data) {
    if (!arguments.length) {
      return this._data;
    }

    let dataTypes;
    if (
      !this._dataTypes ||
      (typeof this._dataType === "object" &&
        Object.keys(this._dataTypes).length)
    ) {
      dataTypes = inferTypes(_data);
    } else {
      dataTypes = this.dataTypes;
    }

    return new RAWChart(
      this._visualModel,
      _data,
      dataTypes,
      this._mapping,
      this._visualOptions
    );
  }

  /**
   * @param {DataTypes} _dataTypes
   * @returns {Chart}
   */
  dataTypes(_dataTypes) {
    if (!arguments.length) {
      return this._dataTypes;
    }
    return new RAWChart(
      this._visualModel,
      this._data,
      _dataTypes,
      this._mapping,
      this._visualOptions
    );
  }

  /**
   * @param {Node} node
   * @returns {Node}
   */
  getContainer(document) {
    //#TODO: this could, in future, depend on visual model
    const container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    const options = this._visualModel.options || baseOptions
    const optionsValues = getDefaultOptions(baseOptions, this._visualOptions)

    const widthOptions = Object.keys(options).filter(
      name => get(options[name], 'container') === 'width'
    )
    const heightOptions = Object.keys(options).filter(
      name => get(options[name], 'container') === 'height'
    )
    const backgroundOptions = Object.keys(options).filter(
      name => get(options[name], 'container') === 'background'
    )
    
    const width = widthOptions.reduce((acc, item) => {
      return acc + optionsValues[item] || 0
    }, 0)
    const height = heightOptions.reduce((acc, item) => {
      return acc + optionsValues[item] || 0
    }, 0)
    
    container.setAttribute("width", width);
    container.setAttribute("height", height);

    if(backgroundOptions.length){
      container.style["background"] = optionsValues[backgroundOptions[0]];
    }
    
    return container;
  }

  mapData() {
    let dimensions = this._visualModel.dimensions;

    validateMapperDefinition(dimensions);
    validateMapping(dimensions, this._mapping, this._dataTypes);

    if (isFunction(this._visualModel.mapData)) {
      const annotatedMapping = annotateMapping(
        dimensions,
        this._mapping,
        this._dataTypes
      );
      return this._visualModel.mapData(
        this._data,
        annotatedMapping,
        this._dataTypes,
        dimensions
      );
    } else if (isObject(this._visualModel.mapData)) {
      const dimensionsWithOperations = dimensions.map((dim) => {
        return {
          ...dim,
          operation: this._visualModel.mapData[dim.id],
        };
      });
      const mapFunction = makeMapper(
        dimensionsWithOperations,
        this._mapping,
        this._dataTypes
      );
      return mapFunction(this._data);
    } else {
      throw new RAWError(
        "mapData property of visualModel should be a function or an object"
      );
    }
  }

  /**
   * @param {Node} node
   * @returns {DOMChart}
   */
  renderToDOM(node) {
    if (!this._visualModel) {
      throw new RAWError("cannot render: visualModel is not set");
    }

    const container = this.getContainer(node.ownerDocument);
    const vizData = this._visualModel.skipMapping ? this._data : this.mapData();
    const dimensions = this._visualModel.dimensions;
    const annotatedMapping = annotateMapping(
      dimensions,
      this._mapping,
      this._dataTypes
    );

    this._visualModel.render(
      container,
      vizData,
      this._visualOptions,
      annotatedMapping,
      this._data
    );
    node.innerHTML = "";
    node.appendChild(container);

    return new DOMChart(
      node,
      this._visualModel,
      this._data,
      this._dataTypes,
      this._mapping,
      this._visualOptions
    );
  }

  /**
   * @param {document} document HTML document context (optional if window is available)
   * @returns {string}
   */
  renderToString(document) {
    if (!this._visualModel) {
      throw new RAWError("cannot render: visualModel is not set");
    }

    if (!document && window === undefined) {
      throw new RAWError("Document must be passed or window available");
    }
    const container = this.getContainer(document || window.document);
    const vizData = this._visualModel.skipMapping ? this._data : this.mapData();
    const dimensions = this._visualModel.dimensions;
    const annotatedMapping = annotateMapping(
      dimensions,
      this._mapping,
      this._dataTypes
    );

    this._visualModel.render(
      container,
      vizData,
      this._visualOptions,
      annotatedMapping,
      this._data
    );
    return container.outerHTML;
  }
}

class DOMChart extends Chart {
  constructor(node, ...args) {
    super(...args);
    this._node = node;
  }
}

/**
 * @typedef DataTypes
 * @global
 * @type {object}
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
 */

/**
 * @typedef MappingDefinition
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
 * @typedef VisualOptionsDefinition
 * @global
 * @type {Array.<VisualOption>}
 */

/**
 * @typedef VisualOptions
 * @global
 * @type {object}
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
 */

/**
 * @typedef VisualModel
 * @global
 * @type {object}
 * @property {RenderFunction} render the render function
 * @property {MappingDefinition} dimensions the dimensions configuration (mapping definition)
 * @property {VisualOptionsDefinition} options the visual options exposed by the model
 * @property {Boolean} [skipMapping=false] if set to true will skip the mapping phase (current mapping is still passed to the render function)
 */

/**
 * @typedef RawConfig
 * @global
 * @type {object}
 * @property {Array.<Object>} data - the tabular data to be represented
 * @property {DataTypes} dataTypes - object with data types annotations (column name => type name)
 * @property {Mapping} mapping - the current mapping of column names to dimensions of the current visual model
 * @property {VisualOptions} visualOptions - visual options
 */

/**
 * raw factory function
 * @description This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class
 * @param {VisualModel} visualModel
 * @param {RawConfig} config
 * @returns {Chart}
 */
function chart(visualModel, config = {}) {
  const { data, dataTypes, mapping, visualOptions = {} } = config;
  const finalVisualOptions = getOptions(
    getDefaultOptions(baseOptions),
    visualOptions
  );
  return new Chart(visualModel, data, dataTypes, mapping, finalVisualOptions);
}

export default chart;
