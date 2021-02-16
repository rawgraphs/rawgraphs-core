import {
  validateMapperDefinition,
  validateMapping,
  annotateMapping,
  default as makeMapper,
} from "./mapping";
import { inferTypes } from "./dataset";
import { RawGraphsError, mergeStyles } from "./utils";
import {
  getOptionsValues,
  getOptionsConfig,
  getContainerOptions,
} from "./options";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import get from "lodash/get"

/**
 * @class
 * @description Internal class used to represent a visual model with its actual configuration of data, dataTypes, mapping, visualOptions and styles.
 */
class Chart {
  /**
   * @param {VisualModel} visualModel visual model
   * @param {Array.<Object>} data
   * @param {Object} dataTypes
   * @param {Object} mapping
   * @param {Object} visualOptions
   * @param {Object} styles
   */
  constructor(visualModel, data, dataTypes, mapping, visualOptions, styles) {
    this._visualModel = visualModel;
    this._data = data;

    if (
      data &&
      (!dataTypes ||
        (typeof dataTypes === "object" &&
          Object.keys(dataTypes).length === 0))
    ) {
      this._dataTypes = inferTypes(data);
    } else {
      this._dataTypes = dataTypes;
    }

    this._mapping = mapping;
    this._visualOptions = visualOptions;
    this._styles = styles;
  }

  /**
   * @param {Array.<Object>} nextData
   * @returns {Chart}
   * @description Sets or updates new data and returns a new Chart instance.
   */
  data(nextData) {
    if (!arguments.length) {
      return this._data;
    }

    let dataTypes;
    if (
      !this._dataTypes ||
      (typeof this._dataType === "object" &&
        Object.keys(this._dataTypes).length)
    ) {
      dataTypes = inferTypes(nextData);
    } else {
      dataTypes = this.dataTypes;
    }

    return new Chart(
      this._visualModel,
      nextData,
      dataTypes,
      this._mapping,
      this._visualOptions,
      this._styles,
    );
  }

  /**
   * @param {DataTypes} nextDataTypes
   * @returns {Chart}
   * @description Sets or updates dataTypes and returns a new Chart instance.
   */
  dataTypes(nextDataTypes) {
    if (!arguments.length) {
      return this._dataTypes;
    }
    return new RAWChart(
      this._visualModel,
      this._data,
      nextDataTypes,
      this._mapping,
      this._visualOptions,
      this._styles,
    );
  }

  /**
   * @param {VisualOptions} nextVisualOptions
   * @returns {Chart}
   * @description Sets or updates visual options and returns a new Chart instance.
   */
  visualOptions(nextVisualOptions) {
    if (!arguments.length) {
      return this._visualOptions;
    }
    return new RAWChart(
      this._visualModel,
      this._data,
      this._dataTypes,
      this._mapping,
      nextVisualOptions,
      this._styles,
    );
  }

  /**
   * @param {styles} Object
   * @returns {Chart}
   * @description Sets or updates styles and returns a new Chart instance.
   */
  styles(_styles) {
    if (!arguments.length) {
      return this._styles;
    }
    return new RAWChart(
      this._visualModel,
      this._data,
      this._dataTypes,
      this._mapping,
      _visualOptions,
      _styles
    );
  }

  /**
   * @param {document} document
   * @param {containerType} string
   * @param {dataReady} array
   * @returns {Node}
   * @private
   * @description Creates the container node that will be passed to the actual chart implementation. In the current implementation, an svg node is always created.
   */
  getContainer(document, containerType, dataReady) {
    //#TODO: this could, in future, depend on visual model

    let container;
    switch (containerType.toLowerCase()) {
      case "canvas":
        container = document.createElement(
          "canvas"
        );
        break;

      case "div":
        container = document.createElement(
          "div"
        );
        break;

      case "svg":
        container = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        break;

      default:
        throw new RawGraphsError(`Container of type ${containerType} is not supported.`);

    }

    const { optionsConfig, optionsValues } = this._getOptions(dataReady)

    const { width, height, style } = getContainerOptions(
      optionsConfig,
      optionsValues
    );

    if (width) {
      container.setAttribute("width", width);
    }
    if (height) {
      container.setAttribute("height", height);
    }

    if (style) {
      Object.keys(style).forEach((k) => {
        container.style[k] = style[k];
      });
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
      throw new RawGraphsError(
        "mapData property of visualModel should be a function or an object"
      );
    }
  }


  _getOptions(dataReady) {
    const optionsConfig = getOptionsConfig(this._visualModel.visualOptions);
    const vizData = dataReady || this._getVizData()
    const optionsValues = getOptionsValues(optionsConfig, this._visualOptions, this._mapping, this._dataTypes, this._data, vizData, this._visualModel);
    return { optionsConfig, optionsValues }
  }

  _getVizData() {
    return this._visualModel.skipMapping ? this._data : this.mapData();
  }

  _getVizStyles() {
    const styles = this._visualModel.styles || {}
    const localStyles = this._styles || {}
    let mergedStyles = mergeStyles(styles, localStyles)
    return mergedStyles
  }

  /**
   * @param {Node} node
   * @returns {DOMChart}
   */
  renderToDOM(node, dataReady) {
    if (!this._visualModel) {
      throw new RawGraphsError("cannot render: visualModel is not set");
    }

    const containerType = get(this._visualModel, 'type', 'svg');
    const container = this.getContainer(node.ownerDocument, containerType, dataReady);
    const vizData = dataReady || this._getVizData()
    const dimensions = this._visualModel.dimensions;
    const annotatedMapping = annotateMapping(
      dimensions,
      this._mapping,
      this._dataTypes
    );
    const styles = this._getVizStyles()

    const { optionsConfig, optionsValues } = this._getOptions(vizData)

    node.innerHTML = "";
    node.appendChild(container);

    this._visualModel.render(
      container,
      vizData,
      optionsValues,
      annotatedMapping,
      this._data,
      styles,
    );


    return new DOMChart(
      node,
      this._visualModel,
      this._data,
      this._dataTypes,
      this._mapping,
      this._visualOptions,
      this._styles,
    );
  }

  /**
   * @param {document} document HTML document context (optional if window is available)
   * @returns {string}
   */
  renderToString(document, dataReady) {
    if (!this._visualModel) {
      throw new RawGraphsError("cannot render: visualModel is not set");
    }

    if (!document && window === undefined) {
      throw new RawGraphsError("Document must be passed or window available");
    }
    const containerType = get(this._visualModel, 'type', 'svg');
    const container = this.getContainer(document || window.document, containerType, dataReady);
    const vizData = dataReady || this._getVizData()
    const dimensions = this._visualModel.dimensions;
    const annotatedMapping = annotateMapping(
      dimensions,
      this._mapping,
      this._dataTypes
    );
    const styles = this._getVizStyles()

    const { optionsConfig, optionsValues } = this._getOptions(vizData)
    // #TODO: TEST THIS FOR HAVING LEGENDS IN renderToString
    //window.document.body.appendChild(container)
    this._visualModel.render(
      container,
      vizData,
      optionsValues,
      annotatedMapping,
      this._data,
      styles,
    );
    return container.outerHTML;
  }
}

/**
 * @class
 * @description Internal class used to represent a Chart instance rendered to a DOM node.
 */
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
 * @property {Boolean} [aggregation] true if a dimension will be aggregated
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
  const { data, dataTypes, mapping, visualOptions = {}, styles = {} } = config;
  return new Chart(visualModel, data, dataTypes, mapping, visualOptions, styles);
}

export default chart;
