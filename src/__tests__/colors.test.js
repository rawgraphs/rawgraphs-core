import { getColorScale } from "../colors"

describe("colors", () => {
  it("should generate an ordinal color scale with schemeCategory10", () => {
    const colorDataset = ["Merlino", "King Kong", "Sandokan"]
    const colorDataType = "string"
    const scaleType = "ordinal"
    const interpolator = "schemeCategory10"

    const colorScale = getColorScale(
      colorDataset,
      colorDataType,
      scaleType,
      interpolator
    )
    //console.log(colorScale.range(), colorScale.domain())

    //expect(types).toEqual({ x: "number", y: "number", c: "string", d: "date" });
  })

  it("should generate an ordinal color scale with interpolateTurbo", () => {
    const colorDataset = ["Merlino", "King Kong", "Sandokan"]
    const colorDataType = "string"
    const scaleType = "ordinal"
    const interpolator = "interpolateTurbo"

    const colorScale = getColorScale(
      colorDataset,
      colorDataType,
      scaleType,
      interpolator
    )
    // console.log(colorScale.range(), colorScale.domain())

    //expect(types).toEqual({ x: "number", y: "number", c: "string", d: "date" });
  })

  it("should generate an ordinal color scale with interpolateSpectral", () => {
    const colorDataset = ["Merlino", "King Kong", "Sandokan"]
    const colorDataType = "string"
    const scaleType = "ordinal"
    const interpolator = "interpolateSpectral"

    const colorScale = getColorScale(
      colorDataset,
      colorDataType,
      scaleType,
      interpolator
    )
    // console.log(colorScale.range(), colorScale.domain())

    //expect(types).toEqual({ x: "number", y: "number", c: "string", d: "date" });
  })

  it("should generate a sequential color scale with interpolateBlues", () => {
    const colorDataset = [1, 2, 3]
    const colorDataType = "number"
    const scaleType = "sequential"
    const interpolator = "interpolateBlues"

    const colorScale = getColorScale(
      colorDataset,
      colorDataType,
      scaleType,
      interpolator
    )
    // console.log(colorScale.range(), colorScale.domain())

    //expect(types).toEqual({ x: "number", y: "number", c: "string", d: "date" });
  })

  it("should generate a diverging color scale with interpolateRdBu", () => {
    const colorDataset = [1, 2, 3, 4, 5]
    const colorDataType = "number"
    const scaleType = "diverging"
    const interpolator = "interpolateRdBu"

    const colorScale = getColorScale(
      colorDataset,
      colorDataType,
      scaleType,
      interpolator
    )
    console.log(colorScale.range(), colorScale.domain())

    //expect(types).toEqual({ x: "number", y: "number", c: "string", d: "date" });
  })
})
