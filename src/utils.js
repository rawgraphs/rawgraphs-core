export class RAWError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RAWError'
    this.message = message
  }
}
