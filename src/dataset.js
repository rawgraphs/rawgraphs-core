/**
 * dataset module.
 * @module dataset
 */

import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isDate from "lodash/isDate";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import isNaN from "lodash/isNaN";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import maxBy from "lodash/maxBy";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { RAWError, getType, NumberParser } from "./utils";
import { timeParse } from "d3-time-format";

dayjs.extend(customParseFormat);

dayjs.extend(utc);

function getFormatter(dataType) {
  if (!isPlainObject(dataType)) {
    return undefined;
  }

  if (isFunction(dataType.decode)) {
    return dataType.decode;
  }

  if (getType(dataType) === Date) {
    if (isString(dataType.dateFormat)) {
      return (value) => dayjs(value, dataType.dateFormat).utc().toDate();
    }
  }

  if (getType(dataType) === Number && isPlainObject(dataType)) {
    const { locale, decimal, group, numerals } = dataType;
    if (locale || decimal || group || numerals) {
      const numberParser = new NumberParser({
        locale,
        decimal,
        group,
        numerals,
      });
      return (value) => numberParser.parse(value);
    }
  }

  if (dataType.type === Boolean) {
  }

  return undefined;
}

function getValueType(value, options = {}) {
  const { strict, locale, numberParser } = options;

  let jsonValue = value;
  if (!strict) {
    try {
      jsonValue = JSON.parse(value);
    } catch (err) {}
  }

  if (numberParser) {
    const numberFromParser = numberParser.parse(jsonValue);
    if (isNumber(numberFromParser) && !isNaN(numberFromParser)) {
      return {
        type: "number",
        locale,
        decimal: numberParser.decimal,
        group: numberParser.group,
        numerals: numberParser.numerals,
      };
    }
  }

  if (isNumber(jsonValue)) {
    return "number";
  }

  if (isBoolean(jsonValue)) {
    return "boolean";
  }

  if (isDate(value)) {
    return "date";
  }

  //#todo: generalize somewhere
  const dateFormatTest = "YYYY-MM-DD";
  const testDateWithFormat = dayjs(value, dateFormatTest).utc();
  if (testDateWithFormat.isValid()) {
    return {
      type: "date",
      dateFormat: dateFormatTest,
    };
  }

  return "string";
}

function castTypeToString(type) {
  return type.name ? type.name.toLowerCase() : type;
}

function castTypesToString(types) {
  return Object.keys(types).reduce((acc, item) => {
    acc[item] = castTypeToString(types[item]);
    return acc;
  }, {});
}

/**
 * Types guessing
 *
 * @param {array} data data to be parsed (list of objects)
 * @param {boolean} strict if strict is false, a JSON parsing of the values is tried. (if strict=false: "true" -> true)
 * @return {object} the types guessed (object with column names as keys and value type as value)
 */
export function inferTypes(data, parsingOptions, sentinelFunction) {
  let candidateTypes = {};
  if (!Array.isArray(data)) {
    return candidateTypes;
  }

  const { strict, locale, decimal, group, numerals } = parsingOptions;
  let numberParser;
  if (locale || decimal || group || numerals) {
    numberParser = new NumberParser({ locale, decimal, group, numerals });
  }

  data.forEach((datum, rowIndex) => {
    // if (rowIndex % 100 === 0) {
    //   console.log("sentinel called row " + rowIndex);
    //   // console.log("s", sentinelFunction())
    //   if (sentinelFunction && sentinelFunction()) {
    //     console.log("sentinel true");
    //     throw new RAWError("PARSER STOPPED!");
    //   }
    // }
    Object.keys(datum).forEach((key) => {
      if (candidateTypes[key] === undefined) {
        candidateTypes[key] = [];
      }
      const inferredType = getValueType(datum[key], {
        strict,
        numberParser,
        locale,
      });
      candidateTypes[key].push(castTypeToString(inferredType));
    });
  });

  let inferredTypes = {};
  Object.keys(candidateTypes).map((k) => {
    let counts = {};
    candidateTypes[k].forEach((type) => {
      if (!counts[type]) {
        counts[type] = { count: 0, value: type };
      }
      counts[type].count += 1;
    });

    const mostFrequentTypeKey = maxBy(
      Object.keys(counts),
      (t) => counts[t].count
    );
    inferredTypes[k] = counts[mostFrequentTypeKey].value;
  });
  return inferredTypes;
}

function basicGetter(rowValue, dataType) {
  if (rowValue === null || rowValue === undefined) {
    return null;
  }
  console.log("dataTyped", dataType, rowValue)
  return dataType(rowValue);
}

function checkType(value, type) {
  if (type === Number && isNaN(value)) {
    throw new RAWError(`invalid type number for value ${value}`);
  }

  if (type === Date && (!(value instanceof Date) || !dayjs(value).isValid())) {
    throw new RAWError(`invalid type date for value ${value}`);
  }
}

// builds a parser function
function rowParser(types, parsingOptions = {}, onError) {
  let propGetters = {};
  const { strict, locale, decimal, group, numerals } = parsingOptions;

  Object.keys(types).forEach((k) => {
    let dataType = types[k];
    const type = getType(dataType);
    const formatter = getFormatter(dataType);
    propGetters[k] = (row) => {
      const rowValue = get(row, k);
      const formattedValue = formatter ? formatter(rowValue) : rowValue;
      const out = basicGetter(formattedValue, formatter ? (x) => x : type);
      checkType(out, type);
      return out;
    };
  });

  return function (row, i) {
    const error = {};
    let out = {};
    Object.keys(propGetters).forEach((k) => {
      const getter = propGetters[k];
      try {
        out[k] = getter(row);
      } catch (err) {
        out[k] = null;
        error[k] = err;
      }
    });

    if (Object.keys(error).length) {
      onError && onError(error, i);
    }
    return out;
  };
}

function parseRows(data, dataTypes, parsingOptions, sentinelFunction) {
  //#TODO: ADD SENTINEL
  let errors = [];
  const parser = rowParser(dataTypes, parsingOptions, (error, i) =>
    errors.push({ row: i, error })
  );
  const dataset = data.map(parser);
  return [dataset, errors];
}

/**
 * @typedef ParserResult
 * @global
 * @type {object}
 * @property {Array} dataset parsed dataset (list of objects)
 * @property {Object} dataTypes dataTypes used for parsing dataset
 * @property {Array} errors list of errors from parsing
 */

/**
 * Dataset parser
 *
 * @param {array} data data to be parsed (list of objects)
 * @param {object} types optional column types
 * @return {ParserResult} dataset, dataTypes, errors
 */
export function parseDataset(data, types, parsingOptions, sentinelFunction) {
  const dataTypes = types || inferTypes(data, parsingOptions, sentinelFunction);
  const [dataset, errors] = parseRows(
    data,
    dataTypes,
    parsingOptions,
    sentinelFunction
  );

  return { dataset, dataTypes, errors };
}
