import { inferTypes, parseDataset } from "../dataset"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

const exampleTypes = [
  String,
  Number,
  Date,
  Boolean,

  "string",
  "date",
  "number",
  "boolean",

  { type: Date, dateFormat: "DD/MM/YYYY" },
  { type: "date", dateFormat: "DD/MM/YYYY" },
  { type: Boolean, decode: (x) => (x.toLowerCase() === "true" ? true : false) },
]

const exampleData = [
  { x: 1, y: 2, c: "M", d: new Date(2020, 0, 1, 0, 0) },
  { x: 2, y: 4, c: "C", d: new Date(2021, 1, 1, 0, 0) },
  { x: 3, y: 6, c: "G", d: new Date(2022, 2, 1, 0, 0) },
]

const exampleDataFormatted = [
  { x: 1, y: 2, c: "M", d: "2020-01-01 00:00" },
  { x: 2, y: 4, c: "C", d: "2021-02-01 00:00" },
  { x: 3, y: 6, c: "G", d: "2022-03-01 00:00" },
]

describe("dataset", () => {
  it("should infer correct types", () => {
    const types = inferTypes(exampleData)
    expect(types).toEqual({ x: "number", y: "number", c: "string", d: "date" })
  })

  it("should get no errors with date formats with decode", () => {
    let types = inferTypes(exampleDataFormatted)
    expect(types).toEqual({
      x: "number",
      y: "number",
      c: "string",
      d: "string",
    })

    types.d = {
      type: Date,
      decode: (value) => dayjs(value, "YYYY-MM-DD HH:mm").toDate(),
    }

    const { dataset, dataTypes, errors } = parseDataset(
      exampleDataFormatted,
      types
    )
    const newTypes = inferTypes(dataset)
    expect(newTypes).toEqual({
      x: "number",
      y: "number",
      c: "string",
      d: "date",
    })

    expect(dataset).toEqual(exampleData)

    // types.d = {
    //   type: Date,
    //   dateFormat: "YYYY-MM-DD HH:mm",
    // };

    // const {
    //   dataset: datasetWithFormat,
    //   dataTypes: dataTypesWithFormat,
    //   errors: errorsWithFormat,
    // } = parseDataset(exampleDataFormatted, types);
    // expect(datasetWithFormat).toEqual(exampleData);
  })
})
