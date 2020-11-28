/**
 * options module.
 * @module options
 */

import get from "lodash/get";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject"
import { ValidationError, RAWError, getTypeName } from "./utils";
import mapValues from "lodash/mapValues";
import { getColorScale } from './colors'
import omitBy from "lodash/omitBy";

export const baseOptions = {
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
    container: { style: "background" },
    group: "artboard",
  },
};

const inputTypeToOptions = {
  text: {
    minLength: null,
    maxLength: null,
    options: null,
  },

  number: {
    step: "any",
    min: null,
    max: null,
    options: null,
  },

  range: {
    step: "any",
    min: 0,
    max: 1,
  },

  color: {
    options: null,
  },

  colorScale: {
    dimension: null,
  },

  boolean: {},

  //#TODO: makes sense?
  // margins: {

  // },
};

export function validateOptionsDefinition(definition) {}

export function getDefaultOptionsValues(definition, mapping) {
  //repeated options are empy at beginning
  return mapValues(definition, (field) => {
    if(!field.repeatFor){
      return field.default
    }
    const mappingItem = get(mapping, field.repeatFor)
    const mappingValue = get(mappingItem, 'value', [])
    return mappingValue.map(() => field.default)
  });
}

export function getOptionsConfig(visualModelOptions) {
  return { ...baseOptions, ...(visualModelOptions || {}) };
}

export function validateValues(definition, values) {}


/**
 * Helper function for checking predicates, used in getEnabledOptions
 * 
 * @param {*} conditionObject 
 * @param {*} values 
 */
function checkPredicates(conditionObject, values){
  const tests = Object.keys(conditionObject).map(
    key => values[key] === conditionObject[key]
  )
  if(tests.filter(x => !!x).length){
    return true
  } else {
    return false
  }
}


export function getEnabledOptions(definition, values) {
  
  let out = {}
  Object.keys(definition).forEach(optionName => {
      if(isPlainObject(definition[optionName].disabled)){
        out[optionName] = !checkPredicates(definition[optionName].disabled, values)
      } else {
        //no disabled condition given, option is always enabled
        out[optionName] = true
      }
  })
  return out
  
}

///

function getContainerOptionValue(item, optionsConfig, optionsValues){
  const currentConfig = optionsConfig[item]
  const modifier = optionsValues[item] || 0
  if(isPlainObject(currentConfig.containerCondition)){
    const tests = Object.keys(currentConfig.containerCondition).map(
      key => optionsValues[key] === currentConfig.containerCondition[key]
    )
    if(tests.filter(x => !!x).length){
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
  );
  const heightOptions = Object.keys(optionsConfig).filter(
    (name) => get(optionsConfig[name], "container") === "height"
  );
  const backgroundOptions = Object.keys(optionsConfig).filter((name) => {
    const container = get(optionsConfig[name], "container");
    return get(container, "style") === "background";
  });

  const width = widthOptions.reduce((acc, item) => {
    const modifier = getContainerOptionValue(item, optionsConfig, optionsValues)
    return acc + modifier;
  }, 0);
 
  const height = heightOptions.reduce((acc, item) => {
    const modifier = getContainerOptionValue(item, optionsConfig, optionsValues)
    return acc + modifier
  }, 0);

  let style = {};

  if (backgroundOptions.length) {
    style["background"] = optionsValues[backgroundOptions[0]];
  }

  return { width, height, style };
}

function validateEnum(def, value) {
  const validValues = get(def, "options", []);
  if (validValues.length && validValues.indexOf(value) === -1) {
    throw new RAWError(`${value} is not a valid option`);
  }
  return value;
}

function validateText(def, value) {
  if (!isString(value)) {
    throw new RAWError("String expected");
  }

  validateEnum(value);

  const len = get(value, "length");
  const minLength = get(def, "minLength");
  if (minLength !== undefined && len < minLength) {
    throw new RAWError(`Min length is ${minLength}`);
  }
  const maxLength = get(def, "maxLength");
  if (maxLength !== undefined && len > maxLength) {
    throw new RAWError(`Max length is ${maxLength}`);
  }
  return value;
}

function validateNumber(def, value) {
  if (!isNumber(value)) {
    throw new RAWError("Number expected");
  }

  validateEnum(value);
  return value;
}

function validateRange(def, value) {
  return value;
}

function validateColor(def, value) {
  validateEnum(value);
  return value;
}

function validateColorScale(def, value, mapping, dataTypes, data, vizData) {
  
  const dimension = def.dimension
  const mappingValue = get(mapping, `[${dimension}].value`);
  const colorDataset = vizData.map(d => get(d, def.dimension))
  const colorDataType = dataTypes[mappingValue]
  ? getTypeName(dataTypes[mappingValue])
  : undefined;

  const {
    scaleType,
    interpolator,
    userScaleValues,
  } = value

  const typedUserScaleValues = colorDataType === 'date' ? userScaleValues.map(x => ({
    domain: new Date(x.domain),
    range: x.range
  })) : userScaleValues

  const scale = getColorScale(
    colorDataset,
    colorDataType,
    scaleType,
    interpolator,
    typedUserScaleValues)

  return scale;
}

function validateBoolean(def, value) {
  return value;
}

/**
 * default validators.
 * #TODO: registration approach?
 */
const validators = {
  text: validateText,
  number: validateNumber,
  range: validateRange,
  color: validateColor,
  colorScale: validateColorScale,
  boolean: validateBoolean,
};

/**
 * options validation and deserialization
 *
 * @param {object} optionsConfig
 * @param {object} optionsValues
 */
export function validateOptions(optionsConfig, optionsValues, mapping, dataTypes, data, vizData) {
  let validated = {};
  let errors = {};

  //validating not undefined values
  Object.keys(optionsValues)
    .filter((k) => optionsValues[k] !== undefined)
    .map((name) => {
      const optionConfig = optionsConfig[name];
      if (!optionConfig) {
        throw new ValidationError(`Visual option ${name} is not available`);
      }

      const validator = get(validators, optionConfig.type);
      const repeatFor = get(optionConfig, 'repeatFor')

      if (validator) {
        if(!repeatFor){
          try {
            validated[name] = validator(optionConfig, optionsValues[name], mapping, dataTypes, data, vizData);
          } catch (err) {
            errors[name] = err.message;
          }
        } else {
          const repeatValuesMapping = get(mapping, repeatFor)
          const repeatValues = get(repeatValuesMapping, 'value', [])
          
          validated[name] = repeatValues.map((value, idx) => {
            try {
              const partialMapping = { ...mapping, [repeatFor]: {...mapping[repeatFor], value: [value]}}
              return validator(optionConfig, optionsValues[name][idx], partialMapping, dataTypes, data, vizData)
            } catch(err){
              errors[name+idx] = err.message;
              return optionsValues[name][idx]
            }
            
          })

        }
        
      } else {
        validated[name] = optionsValues[name];
      }
    });

  const errorNames = Object.keys(errors);
  if (errorNames.length) {
    throw new ValidationError(errors);
  }

  return validated;
}

export function getOptionsValues(definition, values, mapping, dataTypes, data, vizData) {
  const opts = getDefaultOptionsValues(definition, mapping);
  const valuesClean = omitBy(values, (v, k) => v == undefined)
  
  const allValues = {
    ...opts,
    ...valuesClean,
  };
  
  //removing disabled options
  const enabledOptions = getEnabledOptions(definition, allValues)
  const valuesCleanNoDisabled = omitBy(values, (v, k) => !enabledOptions[k])

  const finalValues = {
    ...opts,
    ...valuesCleanNoDisabled,
  };
  
  
  return validateOptions(definition, finalValues, mapping, dataTypes, data, vizData);
}
