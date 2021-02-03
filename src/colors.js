import * as d3Color from "d3-color";
import * as d3ScaleChromatic from "d3-scale-chromatic";
import { scaleDiverging, scaleSequential, scaleOrdinal } from "d3-scale";
import { min, max, extent } from "d3-array";
import isEqual from "lodash/isEqual";
import get from 'lodash/get'
import { quantize, interpolateRgbBasis } from "d3-interpolate";
import uniqBy from "lodash/uniqBy";
import { getValueType } from './dataset'

const NO_COLOR = '#cccccc'

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
};

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
};

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
};

export const colorPresets = {
  sequential,
  diverging,
  ordinal,
};

export function getPresetScale(scaleType, domain, interpolator) {
  if (scaleType === "sequential") {
    return scaleSequential(colorPresets.sequential[interpolator].value)
      .domain(domain)
      .unknown(NO_COLOR)
      .clamp(true);
  } else if (scaleType === "diverging") {
    return scaleDiverging(colorPresets.diverging[interpolator].value)
      .domain(domain)
      .unknown(NO_COLOR)
      .clamp(true);
  } else {

    const interpolatorValue = colorPresets.ordinal[interpolator].value
    let scaleRange =
      Array.isArray(interpolatorValue) 
      ? interpolatorValue
      : quantize(interpolatorValue, domain.length)

    let finalDomain = domain;

    if (scaleRange.length < domain.length) {
      finalDomain = domain.slice(0, scaleRange.length);
      //or
      //const diff = domain.length - scaleRange.length
      //const rangeToAdd = Array.from({length: diff}, () => "#ccc")
      //scaleRange = [...scaleRange, ...rangeToAdd]
    }
    
    return scaleOrdinal().domain(finalDomain).range(scaleRange).unknown(NO_COLOR);
  }
}

export function getColorDomain(colorDataset, colorDataType, scaleType) {
  //
  
  const sample = get(colorDataset, '[0]')
  const sampleDataType = sample !== undefined ? getValueType(sample) : colorDataType
  if (sampleDataType === "string" || scaleType === "ordinal") {
    return uniqBy([...colorDataset], item => item && item.toString()).sort();
  } else {
    //const typedDataset = colorDataType !== 'date' ? colorDataset : colorDataset.map(x => new Date(x))
    //
    const typedDataset = colorDataset
    if (scaleType === "diverging") {
      const minValue = min(typedDataset)
      const maxValue = max(typedDataset)
      let midValue = 0
      if(sampleDataType === 'date'){
        midValue = new Date((minValue.getTime() + maxValue.getTime()) / 2)
      } else {
        midValue = (minValue+maxValue)/2
      }

      return [minValue, midValue, maxValue];
    } else {
      return extent(typedDataset);
    }
  }
}

function finalizeScale(inputScale, userScaleValuesMapped, scaleType) {
  if (
    inputScale.range && isEqual(
      inputScale.range().map((d) => d3Color.color(d).formatHex()),
      userScaleValuesMapped.range
    )
  ) {
    return inputScale.copy().domain(userScaleValuesMapped.domain);
  } else {
    if (scaleType === "ordinal") {
      return inputScale
        .copy()
        .domain(userScaleValuesMapped.domain)
        .range(userScaleValuesMapped.range);
    } else {
      return inputScale
        .copy()
        .domain(userScaleValuesMapped.domain)
        .interpolator(interpolateRgbBasis(userScaleValuesMapped.range));
    }
  }
}

function getUserScaleValuesMapped(userScaleValues) {
  return {
    range: userScaleValues.map((item) => item.range),
    domain: userScaleValues.map((item) => item.domain),
  };
}

export function getInitialScaleValues(domain, scaleType, interpolator) {
  const inputScale = getPresetScale(scaleType, domain, interpolator);
  return domain.map((d, i) => ({
    domain: d,
    range: d3Color.color(inputScale(d)).formatHex(),
    index: i,
  }));
}

export function getColorScale(
  colorDataset, //the array of values of the dataset mapped on the color dimension
  colorDataType,
  scaleType, //
  interpolator,
  userScaleValues,
) {

  if(!colorDataset || !colorDataset.length || !colorDataType || !userScaleValues){
    return getDefaultColorScale(NO_COLOR)
  }
  const domain = getColorDomain(colorDataset, colorDataType, scaleType);
  const presetScale = getPresetScale(scaleType, domain, interpolator);
  const scaleValues =
    userScaleValues || getInitialScaleValues(domain, scaleType, interpolator);
  const scaleValuesMapped = getUserScaleValuesMapped(scaleValues);
  const finalScale = finalizeScale(presetScale, scaleValuesMapped, scaleType);
  return finalScale;
}


export function getDefaultColorScale(defaultColor){
  return scaleOrdinal().unknown(defaultColor)
}

export const scaleTypes = Object.keys(colorPresets)

export function getAvailableScaleTypes(colorDataType, colorDataset){
  if(!colorDataset || !Array.isArray(colorDataset) || !colorDataset.length){
    return ['ordinal']
  }
  
  if (colorDataType === 'number' || colorDataType === 'date') {
    

    const sample = colorDataset[0]
    const valueType = getValueType(sample)
    if(valueType === 'number' || valueType === 'date'){
      return scaleTypes
    }
  }
  
  return ['ordinal']

}