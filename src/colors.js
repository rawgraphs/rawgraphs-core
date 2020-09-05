import * as d3Color from "d3-color";
import * as d3ScaleChromatic from "d3-scale-chromatic";
import { scaleDiverging, scaleSequential, scaleOrdinal } from "d3-scale";
import { min, mean, max, extent } from "d3-array";
import isEqual from "lodash/isEqual";
import { quantize, interpolateRgbBasis } from "d3-interpolate";
import uniq from "lodash/uniq";

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
      .unknown("#ccc")
      .clamp(true);
  } else if (scaleType === "diverging") {
    return scaleDiverging(colorPresets.diverging[interpolator].value)
      .domain(domain)
      .unknown("#ccc")
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
    
    return scaleOrdinal().domain(finalDomain).range(scaleRange).unknown("#ccc");
  }
}

export function getColorDomain(colorDataset, colorDataType, scaleType) {
  if (colorDataType === "string" || scaleType === "ordinal") {
    return uniq([...colorDataset].sort());
  } else {
    if (scaleType === "diverging") {
      return [min(colorDataset), mean(colorDataset), max(colorDataset)];
    } else {
      return extent(colorDataset);
    }
  }
}

function finalizeScale(inputScale, userScaleValuesMapped, scaleType) {
  if (
    inputScale.range && isEqual(
      inputScale.range().map((d) => d3Color.color(d).hex()),
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
    range: d3Color.color(inputScale(d)).hex(),
    index: i,
  }));
}

export function getColorScale(
  colorDataset, //the array of values of the dataset mapped on the color dimension
  colorDataType,
  scaleType, //
  interpolator,
  userScaleValues
) {

  if(!colorDataset || !colorDataType || !userScaleValues){
    return getDefaultColorScale()
  }
  const domain = getColorDomain(colorDataset, colorDataType, scaleType);
  const presetScale = getPresetScale(scaleType, domain, interpolator);
  const scaleValues =
    userScaleValues || getInitialScaleValues(domain, scaleType, interpolator);
  const scaleValuesMapped = getUserScaleValuesMapped(scaleValues);
  const finalScale = finalizeScale(presetScale, scaleValuesMapped, scaleType);
  return finalScale;
}


export function getDefaultColorScale(){
  return scaleOrdinal().unknown("#ccc")
}