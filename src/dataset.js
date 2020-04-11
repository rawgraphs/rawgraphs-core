import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isDate from "lodash/isDate";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import maxBy from "lodash/maxBy";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


function getType(dataType) {
  if (isPlainObject(dataType)) {
    return getType(dataType.type)
  }

  if (isString(dataType)) {
    switch (dataType.toLowerCase()) {
      
      case 'string':
        return String
      case 'number':
        return Number
      case 'boolean':
        return Boolean
      case 'date':
        return Date
      
        default:
        return String
    }
  }

  return dataType

}


function getFormatter(dataType) {
  if (!isPlainObject(dataType)) {
    return undefined
  }

  if (isFunction(dataType.decode)) {
    return dataType.decode;
  }

  if (getType(dataType) === Date) {
    if (isString(dataType.dateFormat)) {
      return value => dayjs(value, dataType.dateFormat).toDate();
    }
  }

  if (dataType.type === Boolean) {
  }

  return undefined;
}

function getValueType(value, strict) {

  let jsonValue = value
  if(!strict){
    try {
      jsonValue = JSON.parse(value)
    } catch(err){} 
  }

  if (isNumber(jsonValue)) {
    return Number;
  }

  if (isBoolean(jsonValue)) {
    return Boolean;
  }

  if (isDate(value)) {
    return Date;
  }

  return String;
}

function castTypeToString(type){
  return type.name ? type.name.toLowerCase() : type
}

function castTypesToString(types){
  return Object.keys(types).reduce((acc, item) => {
    acc[item] = castTypeToString(types[item])
    return acc
  }, {})

}


export function inferTypes(data, strict) {
  let candidateTypes = {};
  if(!Array.isArray(data)){
    return candidateTypes
  }

  data.forEach(datum => {
    Object.keys(datum).forEach(key => {
      if (candidateTypes[key] === undefined) {
        candidateTypes[key] = [];
      }
      const inferredType = getValueType(datum[key], strict)
      candidateTypes[key].push(castTypeToString(inferredType));
    });
  });

  let inferredTypes = {};
  Object.keys(candidateTypes).map(k => {
    let counts = {};
    candidateTypes[k].forEach(type => {
      if (!counts[type]) {
        counts[type] = { count: 0, value: type };
      }
      counts[type].count += 1;
    });

    const mostFrequentTypeKey = maxBy(
      Object.keys(counts),
      t => counts[t].count
    );
    inferredTypes[k] = counts[mostFrequentTypeKey].value;
  });
  return inferredTypes
}

function basicGetter(rowValue, dataType) {
  if (rowValue === null || rowValue === undefined) {
    return null;
  }
  return dataType(rowValue);
}

// builds a parser function
function rowParser(types, onError) {
  let propGetters = {};

  Object.keys(types).forEach(k => {
    let dataType = types[k];
    const type = getType(dataType);
    const formatter = getFormatter(dataType);
    propGetters[k] = row => {
      const rowValue = get(row, k);
      const formattedValue = formatter ? formatter(rowValue) : rowValue;
      return basicGetter(formattedValue, formatter ? x => x : type);
    };
    
  });

  return function(row) {
    const error = {};
    let out = {};
    Object.keys(propGetters).forEach(k => {
      const getter = propGetters[k];
      try {
        out[k] = getter(row);
      } catch (err) {
        out[k] = null;
        error[k] = err;
      }
    });
    if (Object.keys(error).length) {
      onError && onError(error);
    }
    return out;
  };
}

function parseRows(data, dataTypes) {
  let errors = [];
  const parser = rowParser(dataTypes, error => errors.push(error));
  const dataset = data.map(parser);
  return [dataset, errors];
}

export function parseDataset(data, types) {
  const dataTypes = types || inferTypes(data);
  const [dataset, errors] = parseRows(data, dataTypes);

  return [dataset, dataTypes, errors];
}
