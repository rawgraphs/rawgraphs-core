import * as d3Color from "d3-color"
import * as d3ScaleChromatic from "d3-scale-chromatic"
import { scaleDiverging, scaleSequential, scaleOrdinal } from "d3-scale"
import { min, max, extent } from "d3-array"
import isEqual from "lodash/isEqual"
import get from "lodash/get"
import { quantize, interpolateRgbBasis } from "d3-interpolate"
import uniqBy from "lodash/uniqBy"
import { getValueType } from "./dataset"
import { RawGraphsError } from "./utils"

const NO_COLOR = "#cccccc"

const sequential = {
  interpolateBlues: {
    value: d3ScaleChromatic.interpolateBlues,
    label: "Blues (sequential)",
  },
  interpolateGreens: {
    value: d3ScaleChromatic.interpolateGreens,
    label: "Greens (sequential)",
  },
  interpolateReds: {
    value: d3ScaleChromatic.interpolateReds,
    label: "Reds (sequential)",
  },
}

const diverging = {
  interpolateRdBu: {
    value: d3ScaleChromatic.interpolateRdBu,
    label: "RdBu (diverging)",
  },
  interpolateBrBG: {
    value: d3ScaleChromatic.interpolateBrBG,
    label: "BrBG (diverging)",
  },
  interpolatePiYG: {
    value: d3ScaleChromatic.interpolatePiYG,
    label: "PiYG (diverging)",
  },
}

const ordinal = {
  schemeCategory10: {
    value: d3ScaleChromatic.schemeCategory10,
    label: "Category10 (ordinal)",
  },
  interpolateTurbo: {
    value: d3ScaleChromatic.interpolateTurbo,
    label: "Interpolate Turbo (ordinal)",
  },
  interpolateSpectral: {
    value: d3ScaleChromatic.interpolateSpectral,
    label: "Interpolate Spectral (ordinal)",
  },
}
/**
 * @constant
 * @description Color presets objects
 */
export const colorPresets = {
  sequential,
  diverging,
  ordinal,
}

/**
 * @constant
 * @description Scale types (names)
 */
export const scaleTypes = Object.keys(colorPresets)

/**
 *
 * @param {*} scaleType
 * @param {*} domain
 * @param {*} interpolator
 * @returns {function} a d3 scale
 */
export function getPresetScale(scaleType, domain, interpolator) {
  if (scaleType === "sequential") {
    if (!colorPresets.sequential[interpolator]) {
      throw new RawGraphsError(
        `interpolator ${interpolator} not valid for sequential scaletype`
      )
    }
    return scaleSequential(colorPresets.sequential[interpolator].value)
      .domain(domain)
      .unknown(NO_COLOR)
      .clamp(true)
  } else if (scaleType === "diverging") {
    if (!colorPresets.diverging[interpolator]) {
      throw new RawGraphsError(
        `interpolator ${interpolator} not valid for diverging scaletype`
      )
    }
    return scaleDiverging(colorPresets.diverging[interpolator].value)
      .domain(domain)
      .unknown(NO_COLOR)
      .clamp(true)
  } else {
    if (!colorPresets.ordinal[interpolator]) {
      throw new RawGraphsError(
        `interpolator ${interpolator} not valid for ordinal scaletype`
      )
    }
    const interpolatorValue = colorPresets.ordinal[interpolator].value
    let scaleRange = Array.isArray(interpolatorValue)
      ? interpolatorValue
      : quantize(interpolatorValue, domain.length)

    let finalDomain = domain

    if (scaleRange.length < domain.length) {
      finalDomain = domain.slice(0, scaleRange.length)
    }

    return scaleOrdinal()
      .domain(finalDomain)
      .range(scaleRange)
      .unknown(NO_COLOR)
  }
}

/**
 * Extracts the color domain, given a color dataset, a color data type and a scale type
 * for sequential scales will return 2 points domain (min and max values)
 * for diverging scales will have 3 points domain (min value, mid value and max value)
 * for ordinal scales the domain consists of all unique values found in the color dataset
 * @param {*} colorDataset
 * @param {*} colorDataType
 * @param {*} scaleType
 * @returns {Array}
 */
export function getColorDomain(colorDataset, colorDataType, scaleType) {
  const sample = get(colorDataset, "[0]")
  const sampleDataType =
    sample !== undefined ? getValueType(sample) : colorDataType
  if (sampleDataType === "string" || scaleType === "ordinal") {
    return uniqBy([...colorDataset], (item) => item && item.toString()).sort()
  } else {
    const typedDataset = colorDataset
    if (scaleType === "diverging") {
      const minValue = min(typedDataset)
      const maxValue = max(typedDataset)
      let midValue = 0
      if (sampleDataType === "date") {
        midValue = new Date((minValue.getTime() + maxValue.getTime()) / 2)
      } else {
        midValue = (minValue + maxValue) / 2
      }

      return [minValue, midValue, maxValue]
    } else {
      return extent(typedDataset)
    }
  }
}

function finalizeScale(inputScale, userScaleValuesMapped, scaleType) {
  if (
    inputScale.range &&
    isEqual(
      inputScale.range().map((d) => d3Color.color(d).formatHex()),
      userScaleValuesMapped.range
    )
  ) {
    return inputScale.copy().domain(userScaleValuesMapped.domain)
  } else {
    if (scaleType === "ordinal") {
      return inputScale
        .copy()
        .domain(userScaleValuesMapped.domain)
        .range(userScaleValuesMapped.range)
    } else {
      return inputScale
        .copy()
        .domain(userScaleValuesMapped.domain)
        .interpolator(interpolateRgbBasis(userScaleValuesMapped.range))
    }
  }
}

function getUserScaleValuesMapped(userScaleValues) {
  return {
    range: userScaleValues.map((item) => item.range),
    domain: userScaleValues.map((item) => item.domain),
  }
}

/**
 * Compute the initial ranges and domains, given a domain, a scale type and an interpolator. Used to initialize the values that can be overridden by the user
 * @param {*} domain
 * @param {*} scaleType
 * @param {*} interpolator
 * @returns {Array.<Object>}
 */
export function getInitialScaleValues(domain, scaleType, interpolator) {
  const inputScale = getPresetScale(scaleType, domain, interpolator)
  return domain.map((d, i) => ({
    domain: d,
    range: d3Color.color(inputScale(d)).formatHex(),
    index: i,
  }))
}

/**
 *
 * @param {Array} colorDataset the array of values of the dataset mapped on the color dimension
 * @param {'number'|'string'|'date'|DataTypeObject} colorDataType the type of the
 * @param {string} scaleType the name of the scale type used
 * @param {string} interpolator the name of the interpolator used (must be compatible with scaleType)
 * @param {Array.<Object>} userScaleValues overrides of ranges/domains points provided by the user
 * @returns {function} The d3 color scale
 */
export function getColorScale(
  colorDataset,
  colorDataType,
  scaleType,
  interpolator,
  userScaleValues
) {
  if (!colorDataset || !colorDataset.length || !colorDataType) {
    return getDefaultColorScale(NO_COLOR)
  }
  const domain = getColorDomain(colorDataset, colorDataType, scaleType)
  const presetScale = getPresetScale(scaleType, domain, interpolator)
  const scaleValues =
    userScaleValues || getInitialScaleValues(domain, scaleType, interpolator)
  const scaleValuesMapped = getUserScaleValuesMapped(scaleValues)
  const finalScale = finalizeScale(presetScale, scaleValuesMapped, scaleType)
  return finalScale
}

/**
 * @param {*} defaultColor
 * @returns A d3 scale that map any value to the default color.
 */
export function getDefaultColorScale(defaultColor) {
  return scaleOrdinal().unknown(defaultColor)
}

/**
 * @description gets the array of names of available scale types, given the color data type and color dataset
 * @param {*} colorDataType
 * @param {*} colorDataset
 * @returns {Array.<string>}
 */
export function getAvailableScaleTypes(colorDataType, colorDataset) {
  if (!colorDataset || !Array.isArray(colorDataset) || !colorDataset.length) {
    return ["ordinal"]
  }

  if (colorDataType === "number" || colorDataType === "date") {
    const sample = colorDataset[0]
    const valueType = getValueType(sample)
    if (valueType === "number" || valueType === "date") {
      return scaleTypes
    }
  }

  return ["ordinal"]
}
