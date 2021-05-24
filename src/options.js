import get from "lodash/get"
import isString from "lodash/isString"
import isNumber from "lodash/isNumber"
import isPlainObject from "lodash/isPlainObject"
import { ValidationError, RawGraphsError, getTypeName } from "./utils"
import mapValues from "lodash/mapValues"
import { getColorScale, getDefaultColorScale } from "./colors"
import { annotateMapping } from "./mapping"
import omitBy from "lodash/omitBy"

/**
 * @constant
 * @global
 * @description base options that are injected in all charts and extended by the visualOptions declared by the chart implementation
 * @type {Object}
 * @default
 */
export let baseOptions = {
  width: {
    type: "number",
    label: "Width (px)",
    default: 805,
    container: "width",
    group: "artboard",
  },

  height: {
    type: "number",
    label: "Height (px)",
    default: 600,
    container: "height",
    group: "artboard",
  },

  background: {
    type: "color",
    label: "Background",
    default: "#FFFFFF",
    group: "artboard",
  },
}

/**
 *
 * @param {*} newOptions options that will be merged with baseOptions
 */

export function overrideBaseOptions(newOptions) {
  baseOptions = {
    ...baseOptions,
    ...newOptions,
  }
}

export function getDefaultOptionsValues(definition, mapping) {
  //repeated options are empy at beginning
  return mapValues(definition, (field) => {
    if (!field.repeatFor) {
      return field.default
    }
    const mappingItem = get(mapping, field.repeatFor)
    const mappingValue = get(mappingItem, "value", [])
    const repeatDefault = get(field, repeatDefault)
    let getDefaultValue = (field, idx) => field.default
    if (Array.isArray(repeatDefault)) {
      getDefaultValue = (field, idx) =>
        get(repeatDefault, `[${idx}]`, field.default)
    }
    return mappingValue.map((v, i) => getDefaultValue(field, i))
  })
}

export function getOptionsConfig(visualModelOptions) {
  return { ...baseOptions, ...(visualModelOptions || {}) }
}

/**
 * Helper function for checking predicates, used in getEnabledOptions
 *
 * @param {*} conditionObject
 * @param {*} values
 */
function checkPredicates(conditionObject, values) {
  const tests = Object.keys(conditionObject).map(
    (key) => values[key] === conditionObject[key]
  )
  if (tests.filter((x) => !!x).length) {
    return false
  } else {
    return true
  }
}

function checkMapping(requiredDimensions, mapping, optionName) {
  if (!requiredDimensions) {
    return true
  }
  if (requiredDimensions && !Array.isArray(requiredDimensions)) {
    throw new RawGraphsError(
      `the property "requiredDimensions" on ${optionName} option definition must be an array, if present`
    )
  }
  const unmappedDimensions = requiredDimensions
    .map((r) => get(mapping[r], "value", []))
    .filter((x) => !x.length)
  return unmappedDimensions.length === 0
}

export function getEnabledOptions(definition, values, mapping) {
  let out = {}
  Object.keys(definition).forEach((optionName) => {
    out[optionName] = true
    if (isPlainObject(definition[optionName].disabled)) {
      out[optionName] =
        out[optionName] &&
        checkPredicates(definition[optionName].disabled, values)
    }
    if (Array.isArray(definition[optionName].requiredDimensions)) {
      out[optionName] =
        out[optionName] &&
        checkMapping(
          definition[optionName].requiredDimensions,
          mapping,
          optionName
        )
    }
  })
  return out
}

function getContainerOptionValue(item, optionsConfig, optionsValues) {
  const currentConfig = optionsConfig[item]
  const modifier = optionsValues[item] || 0
  if (isPlainObject(currentConfig.containerCondition)) {
    const tests = Object.keys(currentConfig.containerCondition).map(
      (key) => optionsValues[key] === currentConfig.containerCondition[key]
    )
    if (tests.filter((x) => !!x).length) {
      return modifier
    }
    return 0
  } else {
    return modifier
  }
}

export function getContainerOptions(optionsConfig, optionsValues) {
  const widthOptions = Object.keys(optionsConfig).filter(
    (name) => get(optionsConfig[name], "container") === "width"
  )
  const heightOptions = Object.keys(optionsConfig).filter(
    (name) => get(optionsConfig[name], "container") === "height"
  )
  const backgroundOptions = Object.keys(optionsConfig).filter((name) => {
    const container = get(optionsConfig[name], "container")
    return get(container, "style") === "background"
  })

  const width = widthOptions.reduce((acc, item) => {
    const modifier = getContainerOptionValue(item, optionsConfig, optionsValues)
    return acc + modifier
  }, 0)

  const height = heightOptions.reduce((acc, item) => {
    const modifier = getContainerOptionValue(item, optionsConfig, optionsValues)
    return acc + modifier
  }, 0)

  let style = {}

  if (backgroundOptions.length) {
    style["background"] = optionsValues[backgroundOptions[0]]
  }

  return { width, height, style }
}

function validateEnum(def, value) {
  const validValues = get(def, "options", [])
  if (validValues.length && validValues.indexOf(value) === -1) {
    throw new RawGraphsError(`${value} is not a valid option`)
  }
  return value
}

function validateText(def, value) {
  if (!isString(value)) {
    throw new RawGraphsError("String expected")
  }

  validateEnum(value)

  const len = get(value, "length")
  const minLength = get(def, "minLength")
  if (minLength !== undefined && len < minLength) {
    throw new RawGraphsError(`Min length is ${minLength}`)
  }
  const maxLength = get(def, "maxLength")
  if (maxLength !== undefined && len > maxLength) {
    throw new RawGraphsError(`Max length is ${maxLength}`)
  }
  return value
}

function validateNumber(def, value) {
  if (!isNumber(value)) {
    throw new RawGraphsError("Number expected")
  }

  validateEnum(value)
  return value
}

function validateRange(def, value) {
  return value
}

function validateColor(def, value) {
  validateEnum(value)
  return value
}

function simplifyDataType(dataType) {
  return dataType ? dataType.type || dataType : dataType
}

function validateColorScale(
  def,
  value,
  mapping,
  dataTypes,
  data,
  vizData,
  chartImplementation,
  visualOptions
) {
  let colorDataset, colorDataType, mappingValue, isDimension

  const domainFunction = def.domain
  if (domainFunction) {
    const annotatedMapping = annotateMapping(
      chartImplementation.dimensions,
      mapping,
      dataTypes
    )
    Object.keys(annotatedMapping).forEach((k) => {
      if (Array.isArray(annotatedMapping[k].dataType)) {
        annotatedMapping[k].dataType =
          annotatedMapping[k].dataType.map(simplifyDataType)
      } else {
        annotatedMapping[k].dataType = simplifyDataType(
          annotatedMapping[k].dataType
        )
      }
    })

    const { domain, type } = chartImplementation[domainFunction](
      vizData,
      annotatedMapping,
      visualOptions
    )
    colorDataset = domain
    colorDataType = type
    isDimension = false
  } else {
    const dimension = def.dimension
    isDimension = !!dataTypes[mappingValue]
    mappingValue = get(mapping, `[${dimension}].value`)
    colorDataset = vizData.map((d) => get(d, def.dimension))
    colorDataType = dataTypes[mappingValue]
      ? getTypeName(dataTypes[mappingValue])
      : "string"
  }

  const {
    scaleType,
    interpolator,
    userScaleValues,
    defaultColor = "#cccccc",
  } = value

  if (!scaleType || !interpolator) {
    return getDefaultColorScale(defaultColor)
  }

  const typedUserScaleValues =
    colorDataType === "date"
      ? userScaleValues.map((x) => ({
          domain: new Date(x.domain),
          range: x.range,
        }))
      : userScaleValues

  //#TODO CHECK condition
  const filledDataset = colorDataset
    ? colorDataset.filter((x) => x !== undefined)
    : colorDataset
  // const scaleCondition = ((!domainFunction && (!isDimension || (mappingValue && mappingValue.length > 0))) || (domainFunction && colorDataset.length > 0))
  const scaleCondition =
    colorDataType && filledDataset && filledDataset.length > 0
  const scale = scaleCondition
    ? getColorScale(
        colorDataset,
        colorDataType,
        scaleType,
        interpolator,
        typedUserScaleValues
      )
    : getDefaultColorScale(defaultColor)

  return scale
}

function validateBoolean(def, value) {
  return value
}

/**
 * default validators.
 */
const validators = {
  text: validateText,
  number: validateNumber,
  range: validateRange,
  color: validateColor,
  colorScale: validateColorScale,
  boolean: validateBoolean,
}

/**
 * options validation and deserialization
 *
 * @param {object} optionsConfig
 * @param {object} optionsValues
 */
export function validateOptions(
  optionsConfig,
  optionsValues,
  mapping,
  dataTypes,
  data,
  vizData,
  chartImplementation
) {
  let validated = {}
  let errors = {}

  //validating not undefined values
  Object.keys(optionsValues)
    .filter((k) => optionsValues[k] !== undefined)
    .map((name) => {
      const optionConfig = optionsConfig[name]
      if (!optionConfig) {
        throw new ValidationError(`Visual option ${name} is not available`)
      }

      const validator = get(validators, optionConfig.type)
      const repeatFor = get(optionConfig, "repeatFor")

      if (validator) {
        if (!repeatFor) {
          //simple case: options is not repeated
          try {
            validated[name] = validator(
              optionConfig,
              optionsValues[name],
              mapping,
              dataTypes,
              data,
              vizData,
              chartImplementation,
              optionsValues
            )
          } catch (err) {
            process.env.NODE_ENV === "development" && console.error(err)
            errors[name] = err.message
          }
        } else {
          // repeated option case
          // to ease work of rawgraphs frontend, the validation step takes care of integrating missing repeated
          // values with defaults, taking in account `repeatDefault` property if available, `default` otherwise

          const repeatValuesMapping = get(mapping, repeatFor)
          const repeatValues = get(repeatValuesMapping, "value", [])

          validated[name] = repeatValues.map((value, idx) => {
            try {
              const partialMapping = {
                ...mapping,
                [repeatFor]: { ...mapping[repeatFor], value: [value] },
              }

              const hasValue =
                Array.isArray(optionsValues[name]) &&
                optionsValues[name][idx] !== undefined
              let partialValue
              if (hasValue) {
                partialValue = optionsValues[name][idx]
              } else {
                if (Array.isArray(optionConfig.repeatDefault)) {
                  partialValue = get(
                    optionConfig.repeatDefault,
                    `[${idx}]`,
                    optionConfig.default
                  )
                } else {
                  partialValue = optionConfig.default
                }
              }
              return validator(
                optionConfig,
                partialValue,
                partialMapping,
                dataTypes,
                data,
                vizData
              )
            } catch (err) {
              process.env.NODE_ENV === "development" && console.error(err)
              errors[name + idx] = err.message
              return optionsValues[name][idx]
            }
          })
        }
      } else {
        validated[name] = optionsValues[name]
      }
    })

  const errorNames = Object.keys(errors)
  if (errorNames.length) {
    // console.error("error in validation", errors)
    throw new ValidationError(errors)
  }

  return validated
}

export function getOptionsValues(
  definition,
  values,
  mapping,
  dataTypes,
  data,
  vizData,
  chartImplementation
) {
  const opts = getDefaultOptionsValues(definition, mapping)
  const valuesClean = omitBy(values, (v, k) => v == undefined)

  const allValues = {
    ...opts,
    ...valuesClean,
  }

  //removing disabled options
  const enabledOptions = getEnabledOptions(definition, allValues, mapping)
  const valuesCleanNoDisabled = omitBy(values, (v, k) => !enabledOptions[k])

  const finalValues = {
    ...opts,
    ...valuesCleanNoDisabled,
  }

  return validateOptions(
    definition,
    finalValues,
    mapping,
    dataTypes,
    data,
    vizData,
    chartImplementation
  )
}
