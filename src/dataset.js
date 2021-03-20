import isNumber from "lodash/isNumber"
import isDate from "lodash/isDate"
import isPlainObject from "lodash/isPlainObject"
import isString from "lodash/isString"
import isNaN from "lodash/isNaN"
import get from "lodash/get"
import isFunction from "lodash/isFunction"
import maxBy from "lodash/maxBy"
import { RawGraphsError, getType, NumberParser } from "./utils"
import { timeParse, timeFormatLocale } from "d3-time-format"
import { dateFormats } from "./dateFormats"

const EMPTY_DATE_MARKER = "__||_||_||__"

function getFormatter(dataType, parsingOptions = {}) {
  if (!isPlainObject(dataType)) {
    //we have no format, just trying to parse the date with Date.
    if (getType(dataType) === Date) {
      return (value) => {
        if (!value) {
          return EMPTY_DATE_MARKER
        }
        return new Date(value)
      }
    }
  }

  if (isFunction(dataType.decode)) {
    return dataType.decode
  }

  //as our date parsers return 'null' when failing parsing we need another marker. see https://github.com/d3/d3-time-format
  if (getType(dataType) === Date) {
    if (isString(dataType.dateFormat) && !!dateFormats[dataType.dateFormat]) {
      const mappedFormat = dateFormats[dataType.dateFormat]

      const parser = parsingOptions.dateLocale
        ? timeFormatLocale(parsingOptions.dateLocale).parse(mappedFormat)
        : timeParse(mappedFormat)
      return (value) => {
        if (!value) {
          return EMPTY_DATE_MARKER
        }
        const parsedValue = parser(value)
        return parsedValue
      }
    }
  }

  if (getType(dataType) === Number) {
    const { locale, decimal, group, numerals } = parsingOptions
    if (locale || decimal || group || numerals) {
      const numberParser = new NumberParser({
        locale,
        decimal,
        group,
        numerals,
      })

      return (value) => {
        return value !== "" ? numberParser.parse(value) : null
      }
    }
  }

  return undefined
}

export function getValueType(value, options = {}) {
  const { strict, locale, numberParser, dateParser } = options

  let jsonValue = value
  if (!strict) {
    try {
      jsonValue = JSON.parse(value)
    } catch (err) {}
  }

  if (numberParser) {
    const numberFromParser = numberParser.parse(jsonValue)
    if (isNumber(numberFromParser) && !isNaN(numberFromParser)) {
      return {
        type: "number",
        locale,
        decimal: numberParser.decimal,
        group: numberParser.group,
        numerals: numberParser.numerals,
      }
    }
  }

  if (isNumber(jsonValue)) {
    return "number"
  }

  // #TODO: understand if we should handle boolean type
  // if (isBoolean(jsonValue)) {
  //   return {
  //     type: 'string',
  //     formatBoolean: true,
  //   }
  // }

  if (isDate(value)) {
    return "date"
  }

  //testing "YYYY-MM-DD" date format
  if (dateParser) {
    const dateFormatTest = dateFormats["YYYY-MM-DD"]
    const testDateWithFormat = dateParser(dateFormatTest)(value)
    if (testDateWithFormat !== null) {
      return {
        type: "date",
        dateFormat: "YYYY-MM-DD",
      }
    }
  }

  //testing "YYYY-MM-DDTHH:mm:ss" date format
  if (dateParser) {
    const dateFormatTest = dateFormats["YYYY-MM-DDTHH:mm:ss"]
    const testDateWithFormat = dateParser(dateFormatTest)(value)
    if (testDateWithFormat !== null) {
      return {
        type: "date",
        dateFormat: "YYYY-MM-DDTHH:mm:ss",
      }
    }
  }

  return "string"
}

function castTypeToString(type) {
  return type.name ? type.name.toLowerCase() : type
}

function castTypesToString(types) {
  return Object.keys(types).reduce((acc, item) => {
    acc[item] = castTypeToString(types[item])
    return acc
  }, {})
}

/**
 * Types guessing
 *
 * @param {array} data data to be parsed (list of objects)
 * @param {parsingOptions} parsingOptions 
 * @return {DataTypes} the types guessed (object with column names as keys and value type as value)
 */
export function inferTypes(data, parsingOptions = {}) {
  let candidateTypes = {}
  if (!Array.isArray(data)) {
    return candidateTypes
  }

  const {
    strict,
    locale,
    decimal,
    group,
    numerals,
    dateLocale,
  } = parsingOptions
  let numberParser
  if (locale || decimal || group || numerals) {
    numberParser = new NumberParser({ locale, decimal, group, numerals })
  }

  let dateParser
  if (dateLocale) {
    dateParser = timeFormatLocale(dateLocale).parse
  } else {
    dateParser = timeParse
  }

  data.forEach((datum, rowIndex) => {
    Object.keys(datum).forEach((key) => {
      if (candidateTypes[key] === undefined) {
        candidateTypes[key] = []
      }
      const inferredType = getValueType(datum[key], {
        strict,
        numberParser,
        locale,
        dateParser,
      })
      candidateTypes[key].push(castTypeToString(inferredType))
    })
  })

  let inferredTypes = {}
  Object.keys(candidateTypes).map((k) => {
    let counts = {}
    candidateTypes[k].forEach((type) => {
      if (!counts[type]) {
        counts[type] = { count: 0, value: type }
      }
      counts[type].count += 1
    })

    const mostFrequentTypeKey = maxBy(
      Object.keys(counts),
      (t) => counts[t].count
    )
    inferredTypes[k] = counts[mostFrequentTypeKey].value
  })
  return inferredTypes
}

function basicGetter(rowValue, dataType) {
  if (rowValue === null || rowValue === undefined) {
    return null
  }
  return dataType(rowValue)
}

function checkTypeAndGetFinalValue(value, type) {
  if (type === Number && value !== null && isNaN(value)) {
    throw new RawGraphsError(`invalid type number for value ${value}`)
  }

  //as our date parsers return 'null' when failing parsing we need another marker. see https://github.com/d3/d3-time-format
  if (type === Date) {
    if (value === EMPTY_DATE_MARKER) {
      return null
    } else {
      if (!(value instanceof Date)) {
        throw new RawGraphsError(`invalid type date for value ${value}`)
      }
    }
  }

  return value
}

// builds a parser function
function rowParser(types, parsingOptions = {}, onError) {
  let propGetters = {}

  Object.keys(types).forEach((k) => {
    let dataType = types[k]
    const type = getType(dataType)
    const formatter = getFormatter(dataType, parsingOptions)
    propGetters[k] = (row) => {
      const rowValue = get(row, k)
      const formattedValue = formatter ? formatter(rowValue) : rowValue
      let out = basicGetter(formattedValue, formatter ? (x) => x : type)
      out = checkTypeAndGetFinalValue(out, type)
      return out
    }
  })

  return function (row, i) {
    const error = {}
    let out = {}
    Object.keys(propGetters).forEach((k) => {
      const getter = propGetters[k]
      try {
        out[k] = getter(row)
      } catch (err) {
        out[k] = undefined
        error[k] = err.toString()
      }
    })

    if (Object.keys(error).length) {
      onError && onError(error, i)
    }
    return out
  }
}

function filterEmpty(row) {
  return Object.values(row).filter((x) => x !== null && x !== "").length > 0
}

function parseRows(data, dataTypes, parsingOptions) {
  //#TODO: eventually add a sentinel to stop parsing
  let errors = []
  const parser = rowParser(dataTypes, parsingOptions, (error, i) => {
    errors.push({ row: i, error })
  })

  const dataset = data.map(parser).filter(filterEmpty)
  return [dataset, errors]
}

/**
 * Dataset parser
 *
 * @param {array} data data to be parsed (list of objects)
 * @param {DataTypes} [types] optional column types
 * @param {ParsingOptions} [parsingOptions] optional parsing options
 * @return {ParserResult} dataset, dataTypes, errors
 */
export function parseDataset(data, types, parsingOptions) {
  const dataTypes = types || inferTypes(data, parsingOptions)
  const [dataset, errors] = parseRows(data, dataTypes, parsingOptions)
  return { dataset, dataTypes, errors }
}
