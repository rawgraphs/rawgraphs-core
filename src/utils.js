import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import get from "lodash/get";
import { formatLocale } from "d3-format";

export class RAWError extends Error {
  constructor(message) {
    super(message);
    this.name = "RAWError";
    this.message = message;
  }
}

export class ValidationError extends Error {
  constructor(errors) {
    //super(message)
    super("validation error");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export function getType(dataType) {
  if (isPlainObject(dataType)) {
    return getType(dataType.type);
  }

  if (isString(dataType)) {
    switch (dataType.toLowerCase()) {
      case "string":
        return String;
      case "number":
        return Number;
      case "boolean":
        return Boolean;
      case "date":
        return Date;

      default:
        return String;
    }
  }

  return dataType;
}

export function getTypeName(dataType) {
  const type = getType(dataType);
  return type && type.name ? type.name.toLowerCase() : undefined;
}

// taken from: https://observablehq.com/@mbostock/localized-number-parsing
export class LocaleNumberParser {
  constructor(locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const numerals = [
      ...new Intl.NumberFormat(locale, { useGrouping: false }).format(
        9876543210
      ),
    ].reverse();
    const index = new Map(numerals.map((d, i) => [d, i]));
    this._group =
      group ||
      new RegExp(`[${parts.find((d) => d.type === "group").value}]`, "g");
    this._decimal = new RegExp(
      `[${parts.find((d) => d.type === "decimal").value}]`
    );
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = (d) => index.get(d);
  }
  parse(string) {
    return (string = string
      .trim()
      .replace(this._group, "")
      .replace(this._decimal, ".")
      .replace(this._numeral, this._index))
      ? +string
      : NaN;
  }
}

export class NumberParser {
  constructor({ locale, decimal, group, numerals }, useLocale = false) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const defaultGroup = "";
    const defaultDecimal = ".";

    this.numerals =
      numerals ||
      Array.from(
        new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)
      ).reverse();
    this.group =
      group ||
      (useLocale ? parts.find((d) => d.type === "group").value : defaultGroup);
    this.decimal =
      decimal ||
      (useLocale
        ? parts.find((d) => d.type === "decimal").value
        : defaultDecimal);

    const index = new Map(this.numerals.map((d, i) => [d, i]));
    this._groupRegexp = new RegExp(`[${this.group}}]`, "g");
    this._decimalRegexp = new RegExp(`[${this.decimal}]`);
    this._numeralRegexp = new RegExp(`[${this.numerals.join("")}]`, "g");
    this._index = (d) => index.get(d);

    this.formatter = formatLocale({
      decimal: this.decimal,
      //#todo: infer from locale in NumberParser
      grouping: [3],
      thousands: this.group,
      numerals: this.numerals,
    }).format(",");
  }

  parse(string) {
    if (isNumber(string)) {
      return string;
    }
    let out = (string = string
      .trim()
      .replace(this._groupRegexp, "")
      .replace(this._decimalRegexp, ".")
      .replace(this._numeralRegexp, this._index))
      ? +string
      : NaN;

    return out;
  }

  format(n) {
    return this.formatter(n);
  }
}

