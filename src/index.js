export { default as chart } from "./raw";
export { parseDataset, inferTypes } from "./dataset";
export {
  default as makeMapper,
  validateMapping,
  validateMapperDefinition,
  arrayGetter,
} from "./mapping";
export {
  registerAggregation,
  unregisterAggregation,
  getAggregator,
  getAggregatorNames,
} from "./expressionRegister";
export {
  baseOptions,
  getDefaultOptionsValues,
  getOptionsConfig,
} from "./options";
export { getInitialScaleValues, getColorScale, getPresetScale, colorPresets, getColorDomain } from "./colors";
export { getTypeName } from './utils'