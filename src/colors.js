import * as d3Color from "d3-color";
import * as d3ScaleChromatic from "d3-scale-chromatic";
import { scaleDiverging, scaleSequential, scaleOrdinal } from "d3-scale";
import { min, mean, max, extent } from "d3-array";
import isEqual from "lodash/isEqual";
import { quantize, interpolateRgbBasis } from "d3-interpolate";

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

function getPresetScale(scaleType, domain, interpolator) {
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
    let scaleRange =
      interpolator === "schemeCategory10"
        ? colorPresets.ordinal[interpolator].value
        : colorPresets.ordinal[interpolator].value[domain.length]
        ? colorPresets.ordinal[interpolator].value[domain.length]
        : quantize(colorPresets.ordinal[interpolator].value, domain.length);

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

function getColorDomain(colorDataset, colorDataType, scaleType) {
  if (colorDataType === "string") {
    return [...new Set(colorDataset)];
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
    isEqual(
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
  const inputScale = getScale(scaleType, domain, interpolator);
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
  const domain = getColorDomain(colorDataset, colorDataType, scaleType);
  // console.log("domain", domain, scaleType)
  const presetScale = getPresetScale(scaleType, domain, interpolator);
  // console.log("inputScale", inputScale)
  const scaleValues =
    userScaleValues || getInitialScaleValues(domain, scaleType, interpolator);
  // console.log("scaleValues", scaleValues)
  const scaleValuesMapped = getUserScaleValuesMapped(scaleValues);
  // console.log("scaleValuesMapped", scaleValuesMapped)
  const finalScale = finalizeScale(presetScale, scaleValuesMapped, scaleType);
  // console.log("finalScale", finalScale)
  return finalScale;
}
