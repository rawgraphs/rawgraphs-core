import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";

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
  const type = getType(dataType) 
  return type.name ? type.name.toLowerCase() : undefined
  
}


// taken from: https://observablehq.com/@mbostock/localized-number-parsing
export class LocaleNumberParser {
  constructor(locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const numerals = [...new Intl.NumberFormat(locale, {useGrouping: false}).format(9876543210)].reverse();
    const index = new Map(numerals.map((d, i) => [d, i]));
    this._group = group || new RegExp(`[${parts.find(d => d.type === "group").value}]`, "g");
    this._decimal = new RegExp(`[${parts.find(d => d.type === "decimal").value}]`);
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = d => index.get(d);
  }
  parse(string) {
    return (string = string.trim()
      .replace(this._group, "")
      .replace(this._decimal, ".")
      .replace(this._numeral, this._index)) ? +string : NaN;
  }
}

export class NumberParser {
  
  constructor({locale, decimal, group, numerals}) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const _numerals = Array.from(new Intl.NumberFormat(locale, {useGrouping: false}).format(9876543210)).reverse();
    const index = new Map(_numerals.map((d, i) => [d, i]));
    this._group = group || new RegExp(`[${parts.find(d => d.type === "group").value}]`, "g");
    this._decimal = decimal || new RegExp(`[${parts.find(d => d.type === "decimal").value}]`);
    this._numeral = new RegExp(`[${_numerals.join("")}]`, "g");
    this._index = d => {console.log("ciccio", index, d); return index.get(d)};
  }


  parse(string) {
    if(isNumber(string)){
      return string
    }
    let out = (string = string.trim()
      .replace(this._group, "")
      .replace(this._decimal, ".")
      .replace(this._numeral, this._index)) ? +string: NaN
    
    return out
  }
}