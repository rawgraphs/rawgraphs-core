import {
  validateMapperDefinition,
  validateMapping,
  annotateMapping,
  default as makeMapper,
} from "./mapping"
import { inferTypes } from "./dataset"
import { RawGraphsError, mergeStyles } from "./utils"
import {
  getOptionsValues,
  getOptionsConfig,
  getContainerOptions,
} from "./options"
import isObject from "lodash/isObject"
import isFunction from "lodash/isFunction"
import get from "lodash/get"
import * as __defs from "./typeDefs"

/**
 * @class
 * @description Internal class used to represent a visual model with its actual configuration of data, dataTypes, mapping, visualOptions and styles.
 */
class Chart {
  /**
   * @param {ChartImplementation} chartImplementation chart implementation
   * @param {Array.<Object>} data
   * @param {DataTypes} dataTypes
   * @param {Mapping} mapping
   * @param {VisualOptions} visualOptions
   * @param {Object} styles
   */
  constructor(
    chartImplementation,
    data,
    dataTypes,
    mapping,
    visualOptions,
    styles
  ) {
    this._chartImplementation = chartImplementation
    this._data = data

    if (
      data &&
      (!dataTypes ||
        (typeof dataTypes === "object" && Object.keys(dataTypes).length === 0))
    ) {
      this._dataTypes = inferTypes(data)
    } else {
      this._dataTypes = dataTypes
    }

    this._mapping = mapping
    this._visualOptions = visualOptions
    this._styles = styles
  }

  /**
   * @param {Array.<Object>} nextData
   * @returns {Chart}
   * @description Sets or updates new data and returns a new Chart instance.
   */
  data(nextData) {
    if (!arguments.length) {
      return this._data
    }

    let dataTypes
    if (
      !this._dataTypes ||
      (typeof this._dataType === "object" &&
        Object.keys(this._dataTypes).length)
    ) {
      dataTypes = inferTypes(nextData)
    } else {
      dataTypes = this.dataTypes
    }

    return new Chart(
      this._chartImplementation,
      nextData,
      dataTypes,
      this._mapping,
      this._visualOptions,
      this._styles
    )
  }

  /**
   * @param {DataTypes} nextDataTypes
   * @returns {Chart}
   * @description Sets or updates dataTypes and returns a new Chart instance.
   */
  dataTypes(nextDataTypes) {
    if (!arguments.length) {
      return this._dataTypes
    }
    return new RAWChart(
      this._chartImplementation,
      this._data,
      nextDataTypes,
      this._mapping,
      this._visualOptions,
      this._styles
    )
  }

  /**
   * @param {Mapping} nextMapping
   * @returns {Chart}
   * @description Sets or updates mapping and returns a new Chart instance.
   */
  mapping(nextMapping) {
    if (!arguments.length) {
      return this._mapping
    }
    return new RAWChart(
      this._chartImplementation,
      this._data,
      this._dataTypes,
      nextMapping,
      this._visualOptions,
      this._styles
    )
  }

  /**
   * @param {VisualOptions} nextVisualOptions
   * @returns {Chart}
   * @description Sets or updates visual options and returns a new Chart instance.
   */
  visualOptions(nextVisualOptions) {
    if (!arguments.length) {
      return this._visualOptions
    }
    return new RAWChart(
      this._chartImplementation,
      this._data,
      this._dataTypes,
      this._mapping,
      nextVisualOptions,
      this._styles
    )
  }

  /**
   * @param {styles} Object
   * @returns {Chart}
   * @description Sets or updates styles and returns a new Chart instance.
   */
  styles(_styles) {
    if (!arguments.length) {
      return this._styles
    }
    return new RAWChart(
      this._chartImplementation,
      this._data,
      this._dataTypes,
      this._mapping,
      _visualOptions,
      _styles
    )
  }

  /**
   * @param {document} document
   * @param {containerType} string
   * @param {dataReady} (array|object)
   * @returns {Node}
   * @private
   * @description Creates the container node that will be passed to the actual chart implementation. In the current implementation, an svg node is always created.
   */
  getContainer(document, containerType, dataReady) {
    let container
    switch (containerType.toLowerCase()) {
      case "canvas":
        container = document.createElement("canvas")
        break

      case "div":
        container = document.createElement("div")
        break

      case "svg":
        container = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        )
        break

      default:
        throw new RawGraphsError(
          `Container of type ${containerType} is not supported.`
        )
    }

    const { optionsConfig, optionsValues } = this._getOptions(dataReady)

    const { width, height, style } = getContainerOptions(
      optionsConfig,
      optionsValues
    )

    if (width) {
      container.setAttribute("width", width)
    }
    if (height) {
      container.setAttribute("height", height)
    }

    if (style) {
      Object.keys(style).forEach((k) => {
        container.style[k] = style[k]
      })
    }

    return container
  }

  mapData() {
    let dimensions = this._chartImplementation.dimensions

    validateMapperDefinition(dimensions)
    validateMapping(dimensions, this._mapping, this._dataTypes)

    if (isFunction(this._chartImplementation.mapData)) {
      const annotatedMapping = annotateMapping(
        dimensions,
        this._mapping,
        this._dataTypes
      )
      return this._chartImplementation.mapData(
        this._data,
        annotatedMapping,
        this._dataTypes,
        dimensions
      )
    } else if (isObject(this._chartImplementation.mapData)) {
      const dimensionsWithOperations = dimensions.map((dim) => {
        return {
          ...dim,
          operation: this._chartImplementation.mapData[dim.id],
        }
      })
      const mapFunction = makeMapper(
        dimensionsWithOperations,
        this._mapping,
        this._dataTypes
      )
      return mapFunction(this._data)
    } else {
      throw new RawGraphsError(
        "mapData property of chartImplementation should be a function or an object"
      )
    }
  }

  _getOptions(dataReady) {
    const optionsConfig = getOptionsConfig(
      this._chartImplementation.visualOptions
    )
    const vizData = dataReady || this._getVizData()
    const optionsValues = getOptionsValues(
      optionsConfig,
      this._visualOptions,
      this._mapping,
      this._dataTypes,
      this._data,
      vizData,
      this._chartImplementation
    )
    return { optionsConfig, optionsValues }
  }

  _getVizData() {
    return this._chartImplementation.skipMapping ? this._data : this.mapData()
  }

  _getVizStyles() {
    const styles = this._chartImplementation.styles || {}
    const localStyles = this._styles || {}
    let mergedStyles = mergeStyles(styles, localStyles)
    return mergedStyles
  }

  /**
   * @param {Node} node
   * @param {dataReady} (array|object) mapped data if available
   * @returns {DOMChart}
   */
  renderToDOM(node, dataReady) {
    if (!this._chartImplementation) {
      throw new RawGraphsError("cannot render: chartImplementation is not set")
    }

    const containerType = get(this._chartImplementation, "type", "svg")
    const container = this.getContainer(
      node.ownerDocument,
      containerType,
      dataReady
    )
    const vizData = dataReady || this._getVizData()
    const dimensions = this._chartImplementation.dimensions
    const annotatedMapping = annotateMapping(
      dimensions,
      this._mapping,
      this._dataTypes
    )
    const styles = this._getVizStyles()

    const { optionsConfig, optionsValues } = this._getOptions(vizData)

    node.innerHTML = ""
    node.appendChild(container)

    this._chartImplementation.render(
      container,
      vizData,
      optionsValues,
      annotatedMapping,
      this._data,
      styles
    )

    return new DOMChart(
      node,
      this._chartImplementation,
      this._data,
      this._dataTypes,
      this._mapping,
      this._visualOptions,
      this._styles
    )
  }

  /**
   * @param {document} document HTML document context (optional if window is available)
   * @param {dataReady} (array|object) mapped data if available
   * @returns {string}
   */
  renderToString(document, dataReady) {
    if (!this._chartImplementation) {
      throw new RawGraphsError("cannot render: chartImplementation is not set")
    }

    if (!document && window === undefined) {
      throw new RawGraphsError("Document must be passed or window available")
    }
    const containerType = get(this._chartImplementation, "type", "svg")
    const container = this.getContainer(
      document || window.document,
      containerType,
      dataReady
    )
    const vizData = dataReady || this._getVizData()
    const dimensions = this._chartImplementation.dimensions
    const annotatedMapping = annotateMapping(
      dimensions,
      this._mapping,
      this._dataTypes
    )
    const styles = this._getVizStyles()

    const { optionsConfig, optionsValues } = this._getOptions(vizData)
    this._chartImplementation.render(
      container,
      vizData,
      optionsValues,
      annotatedMapping,
      this._data,
      styles
    )
    return container.outerHTML
  }
}

/**
 * @class
 * @description Internal class used to represent a Chart instance rendered to a DOM node.
 * The class has no extra methods for now, but il could be used to provide an "update" functionality in the future.
 */
class DOMChart extends Chart {
  constructor(node, ...args) {
    super(...args)
    this._node = node
  }
}

/**
 * raw factory function
 * @description This is the entry point for creating a chart with raw. It will return an instance of the RAWChart class
 * @param {ChartImplementation} chartImplementation
 * @param {RawConfig} [config] Config object.
 * @returns {Chart}
 */
function chart(chartImplementation, config = {}) {
  const {
    data,
    dataTypes = {},
    mapping,
    visualOptions = {},
    styles = {},
  } = config
  return new Chart(
    chartImplementation,
    data,
    dataTypes,
    mapping,
    visualOptions,
    styles
  )
}

export default chart
