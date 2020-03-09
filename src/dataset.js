import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isDate from "lodash/isDate";
import isPlainObject from "lodash/isPlainObject";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import maxBy from "lodash/maxBy";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)


function getFormatter(dataType) {
  if (isFunction(dataType.decode)) {
    return dataType.decode;
  }

  if (dataType.type === Date) {
    if(dataType.dateFormat instanceof String){
      return value => dayjs(value, dataType.dateFormat).toDate()
    }
  }

  if (dataType.type === Boolean) {
  }

  return undefined;
}

function getValueType(value) {
  if (isNumber(value)) {
    return Number;
  }

  if (isBoolean(value)) {
    return Boolean;
  }

  if (isDate(value)) {
    return Date;
  }

  return String;
}

export function inferTypes(data) {
  let candidateTypes = {};
  data.forEach(datum => {
    Object.keys(datum).forEach(key => {
      if (candidateTypes[key] === undefined) {
        candidateTypes[key] = [];
      }
      candidateTypes[key].push(getValueType(datum[key]));
    });
  });

  let inferredTypes = {};
  Object.keys(candidateTypes).forEach(k => {
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
  return inferredTypes;
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
    if (isPlainObject(dataType)) {
      const type = dataType.type;
      const formatter = getFormatter(dataType);

      propGetters[k] = row => {
        const rowValue = get(row, k);
        const formattedValue = formatter ? formatter(rowValue) : rowValue;
        return basicGetter(formattedValue, formatter ? x => x : dataType.type);
      };
    } else {
      propGetters[k] = row => {
        const rowValue = get(row, k);
        return basicGetter(rowValue, dataType);
      };
    }
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
