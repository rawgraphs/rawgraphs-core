import { RawGraphsError, getTypeName } from "./utils"
import { getAggregator, getAggregatorArray } from "./expressionRegister"
import difference from "lodash/difference"
import get from "lodash/get"
import set from "lodash/set"
import groupBy from "lodash/groupBy"
import groupByAsMap from "./groupBy"
import mapValues from "lodash/mapValues"
import flatten from "lodash/flatten"
import keyBy from "lodash/keyBy"
import find from "lodash/find"
import range from "lodash/range"
import { group, groups, rollup, rollups } from "d3-array"
import isString from "lodash/isString"

/**
 * dimensions validator
 *
 * @param {array} dimensions
 */

export function validateMapperDefinition(dimensions) {
  if (!Array.isArray(dimensions)) {
    throw new RawGraphsError("dimesions must be an array")
  }

  if (dimensions.length === 0) {
    throw new RawGraphsError("empty dimensions")
  }
}

export function validateDeclarativeMapperDefinition(dimensions) {
  if (dimensions.length === 0) {
    throw new RawGraphsError("empty dimensions")
  }

  const getters = dimensions.filter((d) => d.operation === "get")
  const grouperTypes = ["rollup", "rollups"]
  let grouperDimension = dimensions.filter(
    (d) => grouperTypes.indexOf(d.operation) !== -1
  )
  if (grouperDimension.length > 1) {
    throw new RawGraphsError(
      `only one operation among ${grouperTypes.join(",")} is allowed`
    )
  }

  if (getters.length === 0 && !grouperDimension.length) {
    throw new RawGraphsError(
      `at least one get operation must be present in a dimension set, or an operation among ${grouperTypes.join(
        ","
      )} must be specified`
    )
  }

  if (getters.length > 0 && grouperDimension.length) {
    throw new RawGraphsError(
      `'${grouperDimension[0].operation}' operation was specified, you cannot define other get operations`
    )
  }
}

/**
 * mapping validator
 *
 * @param {array} mapper definition
 * @param {object} mapping configuration
 * @param {object} types column datatypes
 *
 */

export function validateMapping(dimensions, _mapping, types) {
  //mapping values must be column names
  let mapping = mapValues(_mapping, (v) => ({
    ...v,
    value: Array.isArray(v.value)
      ? v.value
      : isString(v.value)
      ? [v.value]
      : [],
  }))

  const dimensionsById = keyBy(dimensions, "id")

  // validating that all required dimensions are provided to mapping
  const requiredDimensions = dimensions
    .filter((d) => d.required)
    .map((d) => d.id)
    .sort()

  const providedDimensions = Object.keys(mapping)
    .filter((k) => get(mapping[k], "value") && mapping[k].value.length > 0)
    .sort()

  const missing = difference(requiredDimensions, providedDimensions)

  let errors = []

  if (missing.length > 0) {
    const err = `Some required dimensions were not mapped. Missing ids are: ${missing.join(
      ", "
    )}`
    errors.push(err)
  }

  // validating that provided dimensions are mapped to correct types ("validTypes" attibute of dimension)
  // validating multiple attribute
  providedDimensions.forEach((d) => {
    const values = mapping[d].value || []
    const dim = dimensionsById[d]
    let validTypes = get(dim, "validTypes")
    if (validTypes && types) {
      validTypes = Array.isArray(validTypes) ? validTypes : [validTypes]
      validTypes = validTypes.map((item) => item.toLowerCase())

      values.forEach((v) => {
        const type = getTypeName(types[v])
        if (validTypes && validTypes.indexOf(type.toLowerCase()) === -1) {
          errors.push(
            `Invalid type: column ${v} of type ${type} cannot be used on dimension with id ${d}, accepting ${validTypes.join(
              ", "
            )}`
          )
        }
      })
    }

    let multiple = get(dim, "multiple", false)
    if (!multiple && values && values.length > 1) {
      errors.push(`dimension ${d} does not support multiple columns in mapping`)
    }

    let minValues = get(dim, "minValues")
    if (minValues !== undefined && (!values || values.length < minValues)) {
      errors.push(
        `dimension ${d} requires at least ${minValues} columns in mappung`
      )
    }

    let maxValues = get(dim, "maxValues")
    if (maxValues !== undefined && (!values || values.length > maxValues)) {
      errors.push(
        `dimension ${d} accepts at most ${maxValues} columns in mappung`
      )
    }
  })

  // #TODO: [future] if using registered functions check for existence
  // #TODO: [future] if using expressions check for existence
  // #TODO: check for multiple, minValues, maxValues

  if (errors.length) {
    throw new RawGraphsError(errors.join("\n"))
  }
}

export function annotateMapping(dimensions, _mapping, types) {
  const dimensionsById = keyBy(dimensions, "id")
  let mapping = {}
  const dimensionsIds = Object.keys(dimensionsById)

  Object.keys(_mapping).forEach((id) => {
    mapping[id] = { ..._mapping[id] }

    const dim = dimensionsById[id]
    //dimension not mapped: set value to empty
    if (!mapping[id].value || mapping[id].value === undefined) {
      mapping[id].value = []
    } else {
      //not-multiple values back to scalar
      if (!dim.multiple) {
        const v = Array.isArray(mapping[id].value)
          ? mapping[id].value[0]
          : mapping[id].value
        mapping[id].value = v

        if (dim.aggregation) {
          const aggregationConfig = get(mapping[id], "config.aggregation", [])
          const aggregationForDimension = Array.isArray(aggregationConfig)
            ? aggregationConfig[0]
            : aggregationConfig

          mapping[id].config = {
            ...(mapping[id].config || {}),
            aggregation: aggregationForDimension,
          }
        }

        //setting data type
        mapping[id].dataType = get(types, v)
      } else {
        //setting data types for multiple dimensions
        mapping[id].dataType = mapping[id].value.map((v) => get(types, v))
      }
    }
  })

  dimensionsIds.forEach((dimId) => {
    if (!mapping[dimId]) {
      mapping[dimId] = {
        value: dimensionsById[dimId].multiple ? [] : undefined,
      }
    }
  })

  return mapping
}

function hydrateProxies(dimensions, mapping) {
  let m = mapValues(mapping, (v) => ({
    ...v,
    value: Array.isArray(v.value) ? v.value : [v.value],
  }))

  const proxiesDimensions = dimensions.filter(
    (dim) => dim.operation === "proxy"
  )

  proxiesDimensions.forEach((dimension) => {
    const targets = get(dimension, "targets")
    if (!targets) {
      return
    }

    const targetDimensions = Object.keys(targets)

    targetDimensions.forEach((targetDimensionId) => {
      const targetsMap = targets[targetDimensionId]
      //should be an obj with keys as target expressions and values as source expressions
      Object.keys(targetsMap).forEach((targetExpression) => {
        const sourceExpression = targetsMap[targetExpression]
        const value = get(mapping, `[${dimension.id}][${sourceExpression}]`)
        if (!m[targetDimensionId]) {
          m[targetDimensionId] = {}
        }
        set(m[targetDimensionId], targetExpression, value)
      })
    })
  })
  return m
}

export function arrayGetter(names) {
  if (Array.isArray(names)) {
    return names.length === 1
      ? (item) => get(item, names[0])
      : (item) => names.map((name) => get(item, name))
  }
  return (item) => get(item, names)
}

/**
 * mapper generator
 *
 * @param {array} dimensions mapper definition
 * @param {object} mapping mapping configuration
 * @param {types} types column types
 * @return {function} the mapper function
 */

// #TODO: REFACTOR
function makeMapper(dimensionsWithOperations, _mapping, types) {
  validateDeclarativeMapperDefinition(dimensionsWithOperations)
  let mapping = hydrateProxies(dimensionsWithOperations, _mapping)
  validateMapping(dimensionsWithOperations, mapping, types)

  mapping = mapValues(_mapping, (v) => ({
    ...v,
    value: Array.isArray(v.value)
      ? v.value
      : isString(v.value)
      ? [v.value]
      : [],
  }))

  const mappingValues = mapValues(mapping, (v) => v.value)
  const mappingConfigs = mapValues(mapping, (v) => get(v, "config"))

  const getDimensions = dimensionsWithOperations
    .filter((d) => d.operation === "get" && mappingValues[d.id] !== undefined)
    .map((g) => g.id)

  const groupAggregateDimension = get(
    find(
      dimensionsWithOperations,
      (d) =>
        d.operation === "groupAggregate" && mappingValues[d.id] !== undefined
    ),
    "id"
  )

  const groupByDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "groupBy" && mappingValues[d.id] !== undefined
    ),
    "id"
  )
  const groupDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "group" && mappingValues[d.id] !== undefined
    ),
    "id"
  )
  const groupsDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "groups" && mappingValues[d.id] !== undefined
    ),
    "id"
  )

  const rollupDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "rollup" && mappingValues[d.id] !== undefined
    ),
    "id"
  )

  const rollupsDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "rollups" && mappingValues[d.id] !== undefined
    ),
    "id"
  )

  const rollupLeafDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "rollupLeaf" && mappingValues[d.id] !== undefined
    ),
    "id"
  )

  //#TODO ... is this still needed?
  const hierarchyDimension = get(
    find(
      dimensionsWithOperations,
      (d) => d.operation === "hierarchy" && mappingValues[d.id] !== undefined
    ),
    "id"
  )

  //#TODO: TAKE IN ACCOUNT GROUP AGGREGATE DUE TO FORMATS
  const formatAggregateDimensions = getDimensions.filter((id) =>
    get(mappingConfigs[id], "format")
  )

  const candidateGroupers = [
    groupByDimension,
    groupDimension,
    groupsDimension,
    rollupDimension,
    rollupsDimension,
  ].filter((x) => !!x)
  if (candidateGroupers.length > 1) {
    throw new RawGraphsError(
      "only one of these operations is allowed in a mapper definition: 'group', 'groups', 'groupBy', 'rollup', 'rollups'"
    )
  }

  let grouperDimension
  if (candidateGroupers.length) {
    grouperDimension = candidateGroupers[0]
  }

  const rollupGrouperDimension = rollupDimension || rollupsDimension

  return function (data) {
    if (!data) {
      return
    }

    let tabularData

    //apply grouping operations if any
    if (groupAggregateDimension) {
      // #todo: this is complex. allow only strings in this case
      const identifiers = flatten([mappingValues[groupAggregateDimension]])

      const dataGroups = groupBy(data, (row) => {
        const labelPieces = identifiers.map((x) => get(row, x))
        return JSON.stringify(labelPieces)
      })

      tabularData = Object.keys(dataGroups).map((label) => {
        let item = {}
        const group = dataGroups[label]

        item[groupAggregateDimension] = JSON.parse(label)
        if (item[groupAggregateDimension].length === 1) {
          item[groupAggregateDimension] = item[groupAggregateDimension][0]
        }

        getDimensions.forEach((getter) => {
          const getterColumn = mappingValues[getter]
          //#GET HERE
          const getterFunction = arrayGetter(getterColumn)
          const allData = group.map((d) => getterFunction(d))
          const getterInAggregator = identifiers.indexOf(getterColumn) !== -1
          const aggregator = get(
            mappingConfigs[getter],
            "aggregation",
            getterInAggregator ? (data) => data[0] : (data) => data.length
          )
          const aggregatorFunction =
            Array.isArray(getterColumn) && getterColumn.length > 1
              ? getAggregatorArray(aggregator, getterColumn.length)
              : getAggregator(aggregator)
          item[getter] = aggregatorFunction(allData)
        })
        if (groupDimension || groupsDimension) {
          if (Array.isArray(mappingValues[groupDimension])) {
            item[groupDimension] = mappingValues[groupDimension].map((v) =>
              get(group[0], v)
            )
          } else {
            item[groupDimension] = get(group[0], mappingValues[groupDimension])
          }
        }

        return item
      })
    } else {
      let getterFunctionsById = getDimensions.reduce((acc, id) => {
        acc[id] = arrayGetter(mappingValues[id])
        return acc
      }, {})

      let itemFiller = (row) => mapValues(getterFunctionsById, (f) => f(row))

      tabularData = data.map((row) => {
        let item = itemFiller(row)
        if (grouperDimension && mappingValues[grouperDimension]) {
          if (Array.isArray(mappingValues[grouperDimension])) {
            item[grouperDimension] = mappingValues[grouperDimension].map((v) =>
              get(row, v)
            )
          } else {
            item[grouperDimension] = get(row, mappingValues[grouperDimension])
          }
        }
        // getter for rollup aggregation
        // notice that the name __leaf is used only internally.
        if (
          (rollupGrouperDimension && mappingConfigs[rollupGrouperDimension]) ||
          rollupLeafDimension
        ) {
          let rollupConfigAggregationTarget
          if (rollupLeafDimension) {
            rollupConfigAggregationTarget = get(
              mappingValues,
              rollupLeafDimension
            )
          } else {
            rollupConfigAggregationTarget = get(
              mappingConfigs,
              `[${rollupGrouperDimension}].leafAggregation[1]`
            )
          }
          const getterFunction = arrayGetter(rollupConfigAggregationTarget)
          item["__leaf"] = getterFunction(row)
        }

        return item
      })
    }

    //#TODO
    //apply hierarchy operation if any
    // if (hierarchyDimension) {
    //   // ...
    // }

    if (grouperDimension) {
      if (groupByDimension) {
        return groupByAsMap(tabularData, groupByDimension)
      }

      const grouperDims = Array.isArray(mappingValues[grouperDimension])
        ? mappingValues[grouperDimension]
        : [mappingValues[grouperDimension]]

      const grouperGetters = range(grouperDims.length).map((idx) => (item) =>
        item[grouperDimension][idx]
      )

      if (groupDimension) {
        return group(tabularData, ...grouperGetters)
      }
      if (groupsDimension) {
        return groups(tabularData, ...grouperGetters)
      }

      if (rollupGrouperDimension) {
        let rollupAggregation = (v) => v.length
        let aggregatorFunction

        if (rollupLeafDimension) {
          let [aggName, targetColumn] = [
            get(mappingConfigs, `[${rollupLeafDimension}].aggregation`),
            get(mappingValues, rollupLeafDimension),
          ]

          aggregatorFunction =
            Array.isArray(targetColumn) && targetColumn.length > 1
              ? getAggregatorArray(aggName, targetColumn.length)
              : getAggregator(aggName)
        } else {
          const rollupConfigAggregation = get(
            mappingConfigs,
            `[${rollupGrouperDimension}].leafAggregation`
          )

          if (rollupConfigAggregation) {
            if (
              !Array.isArray(rollupConfigAggregation) ||
              rollupConfigAggregation.length !== 2
            ) {
              throw new RawGraphsError(
                "Rollup aggregation should be an array with aggregation function and target column"
              )
            }
            const [aggName, targetColumn] = rollupConfigAggregation

            aggregatorFunction =
              Array.isArray(targetColumn) && targetColumn.length > 1
                ? getAggregatorArray(aggName, targetColumn.length)
                : getAggregator(aggName)
          }
        }

        if (aggregatorFunction) {
          const leafGetter = arrayGetter("__leaf")
          const wrappedAggregatorFunction = (items) => {
            return aggregatorFunction(items.map(leafGetter))
          }

          rollupAggregation = wrappedAggregatorFunction
        }

        const finalRollupFunction = rollupDimension ? rollup : rollups
        return finalRollupFunction(
          tabularData,
          rollupAggregation,
          ...grouperGetters
        )
      }
    }

    return tabularData
  }
}
//#TODO: SHOULD NOT BE DEFAULT
export default makeMapper
