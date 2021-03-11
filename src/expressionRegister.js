import { RawGraphsError, getTypeName } from "./utils"
import mean from "lodash/mean"
import max from "lodash/max"
import min from "lodash/min"
import sum from "lodash/sum"
import isFunction from "lodash/isFunction"
import isString from "lodash/isString"
import uniq from "lodash/uniq"
import range from "lodash/range"
import find from "lodash/find"
import get from "lodash/get"
import isPlainObject from "lodash/isPlainObject"
import { median } from "d3-array"
// import first from 'lodash/first'
// import last from 'lodash/last'

const aggregationsRegister = {}

export function registerAggregation(name, fun) {
  aggregationsRegister[name] = fun
}

export function unregisterAggregation(name) {
  delete aggregationsRegister[name]
}

export function getAggregatorNames() {
  return Object.keys(aggregationsRegister)
}

export function getAggregator(aggregatorExpression) {
  if (isFunction(aggregatorExpression)) {
    return aggregatorExpression
  }

  if (isString(aggregatorExpression)) {
    if (aggregationsRegister[aggregatorExpression]) {
      return aggregationsRegister[aggregatorExpression]
    } else {
      throw new RawGraphsError(
        `Aggregator "${aggregatorExpression}" is is not registered in RawGraphs.`
      )
    }
  }
}

export function getAggregatorArray(aggregator, length) {
  return function (items) {
    return range(length).map((idx) => {
      const aggregatorExpression = Array.isArray(aggregator)
        ? get(aggregator, idx, aggregator[0])
        : aggregator
      const aggr = getAggregator(aggregatorExpression)
      return aggr(items.map((i) => i[idx]))
    })
  }
}

// Aggregators available in RAW
// general purpose
registerAggregation("count", (items) => items.length)
registerAggregation("countDistinct", (items) => uniq(items).length)
// #TODO understand if we must add these
// registerAggregation("last", last)
// registerAggregation("first", first)

// numbers
registerAggregation("mean", mean)
registerAggregation("max", max)
registerAggregation("min", min)
registerAggregation("sum", sum)
registerAggregation("median", median)

//string
const commaSeparated = (items) => items.join(",")
// #TODO understand if we must add these
// const tabSeparated = items => items.join("\t")
// const newLineSeparated = items => items.join("\n")
// const itemsList = items => items
// const itemsUniq = items => uniq(items)

registerAggregation("csv", commaSeparated)
registerAggregation("csvDistinct", (items) => commaSeparated(uniq(items)))
// #TODO understand if we must add these
// registerAggregation("commaSeparated", commaSeparated)
// registerAggregation("tsv", tabSeparated)
// registerAggregation("tsvDistinct", items => tabSeparated(uniq(items)))
// registerAggregation("tabSeparated", tabSeparated)
// registerAggregation("newLineSeparated", newLineSeparated)
// registerAggregation("list", itemsList)
// registerAggregation("distinct", itemsUniq)

export function getDefaultDimensionAggregation(dimension, dataType) {
  if (!dimension.aggregation) {
    throw new RawGraphsError(`Dimension ${dimension.id} is not aggregable`)
  }
  const names = getAggregatorNames()

  const typeName = getTypeName(dataType)
  const defaultAggregation = get(dimension, "aggregationDefault")

  //#TODO check that default aggregation exists in registered ones
  if (defaultAggregation) {
    if (isPlainObject(defaultAggregation)) {
      return get(defaultAggregation, typeName, names[0])
    } else {
      return defaultAggregation
    }
  }
  return names[0]
}

export function getDimensionAggregator(
  dimensionId,
  mapping,
  dataTypes,
  dimensions
) {
  const dimension = find(dimensions, (x) => x.id === dimensionId)

  const mappingValue = get(
    mapping[dimensionId],
    "value",
    dimension.multiple ? [] : undefined
  )

  //#TODO: this is done to return function returning a scalar in any case
  // works well with undefined "size" dimensions (See matrix plot at rawgraphs-charts at commit 04013f633e32f4c630a5db2b855c6cf270b3af03),
  // but this needs investigation
  if (!dimension.multiple && !mappingValue) {
    return () => 1
  }

  function getSingleDim(dimension, columnName, index) {
    const dataType = get(dataTypes, columnName)
    const defaultAggregation = getDefaultDimensionAggregation(
      dimension,
      dataType
    )
    let aggregation = get(
      mapping[dimension.id],
      "config.aggregation",
      defaultAggregation
    )
    if (index !== undefined) {
      aggregation = aggregation[index]
    }
    const aggregator = getAggregator(aggregation)
    return aggregator
  }

  if (Array.isArray(mappingValue)) {
    const out = mappingValue.map((columnName, i) =>
      getSingleDim(dimension, columnName, i)
    )
    return out
  } else {
    return getSingleDim(dimension, mappingValue)
  }
}
