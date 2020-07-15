export class RAWError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RAWError'
    this.message = message
  }
}



export class ValidationError extends Error {
  constructor(errors) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}