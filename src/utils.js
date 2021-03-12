import isPlainObject from "lodash/isPlainObject"
import isString from "lodash/isString"
import isNumber from "lodash/isNumber"
import get from "lodash/get"
import { formatLocale } from "d3-format"

export class RawGraphsError extends Error {
  constructor(message) {
    super(message)
    this.name = "RawGraphsError"
    this.message = message
  }
}

export class ValidationError extends Error {
  constructor(errors) {
    super("validation error")
    this.name = "ValidationError"

    this.message = Object.values(errors).join("\n")
    this.errors = errors
  }
}

export function getType(dataType) {
  if (isPlainObject(dataType)) {
    return getType(dataType.type)
  }

  if (isString(dataType)) {
    switch (dataType.toLowerCase()) {
      case "string":
        return String
      case "number":
        return Number
      case "boolean":
        return Boolean
      case "date":
        return Date

      default:
        return String
    }
  }

  return dataType
}

export function getTypeName(dataType) {
  const type = getType(dataType)
  return type && type.name ? type.name.toLowerCase() : undefined
}

// taken from: https://observablehq.com/@mbostock/localized-number-parsing
export class LocaleNumberParser {
  constructor(locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
    const numerals = [
      ...new Intl.NumberFormat(locale, { useGrouping: false }).format(
        9876543210
      ),
    ].reverse()
    const index = new Map(numerals.map((d, i) => [d, i]))
    this._group =
      group ||
      new RegExp(`[${parts.find((d) => d.type === "group").value}]`, "g")
    this._decimal = new RegExp(
      `[${parts.find((d) => d.type === "decimal").value}]`
    )
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g")
    this._index = (d) => index.get(d)
  }
  parse(string) {
    return (string = string
      .trim()
      .replace(this._group, "")
      .replace(this._decimal, ".")
      .replace(this._numeral, this._index))
      ? +string
      : NaN
  }
}

export class NumberParser {
  constructor({ locale, decimal, group, numerals }, useLocale = false) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
    const defaultGroup = ""
    const defaultDecimal = "."

    this.numerals =
      numerals ||
      Array.from(
        new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)
      ).reverse()
    this.group =
      group ||
      (useLocale ? parts.find((d) => d.type === "group").value : defaultGroup)
    this.decimal =
      decimal ||
      (useLocale
        ? parts.find((d) => d.type === "decimal").value
        : defaultDecimal)

    const index = new Map(this.numerals.map((d, i) => [d, i]))

    //#todo: infer from locale in NumberParser
    const groupingChars = 3

    this._groupRegexp = new RegExp(
      `[${this.group}}](\\d{${groupingChars}})`,
      "g"
    )
    this._decimalRegexp = new RegExp(`[${this.decimal}]`)
    this._numeralRegexp = new RegExp(`[${this.numerals.join("")}]`, "g")
    this._index = (d) => index.get(d)

    this.formatter = formatLocale({
      decimal: this.decimal,
      grouping: [groupingChars],
      thousands: this.group,
      numerals: this.numerals,
    }).format(",")
  }

  parse(string) {
    if (isNumber(string)) {
      return string
    }

    const trimmedString = string.trim ? string.trim() : string.toString().trim()
    const parsed = trimmedString
      .replace(this._groupRegexp, function (match, captured) {
        return captured
      })
      .replace(this._decimalRegexp, ".")
      .replace(this._numeralRegexp, this._index)

    let out = parsed ? +parsed : NaN
    return out
  }

  format(n) {
    return this.formatter(n)
  }
}

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
export function mergeStyles(target, source) {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], mergeStyles(target[key], source[key]))
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}
