import rawChart from "../rawGraphs"
import testChart from "../testSupport/chart"
import { tsvParse } from "d3-dsv"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"

const dom = new JSDOM(`<!DOCTYPE html><head></head><body></body>`)
const document = dom.window.document
//hack for generating valid svgs with jsdom
const createElementNS = document.createElementNS.bind(document)
document.createElementNS = (ns, name) => {
  const o = createElementNS(ns, name)
  o.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  return o
}

var dataPath = path.join(__dirname, "../testSupport/titanic.tsv")
var titanic = fs.readFileSync(dataPath, "utf8")
const testData = tsvParse(titanic)
const dispersionMapping = {
  x: {
    value: ["Age"],
  },
  y: {
    value: "Fare",
  },
}

describe("raw", () => {
  it("should be hello raw", () => {
    const viz = rawChart(testChart, {
      data: testData,
      mapping: dispersionMapping,
      //dataTypes: some,
      visualOptions: {},
    })

    const { optionsConfig, optionsValues } = viz._getOptions()
    console.log(optionsConfig)
    console.log(optionsValues)

    const div = document.createElement("div")
    viz.renderToDOM(div)
  })

  it("should be hello raw", () => {})
})
