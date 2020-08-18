import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";

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