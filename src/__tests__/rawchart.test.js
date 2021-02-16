import rawChart from "../raw";
import testChart from "../testSupport/chart";

import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { arrayGetter } from "../../src";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";

import { tsvParse } from "d3-dsv";
import { JSDOM } from "jsdom";

import fs from "fs";
import path from "path";

const dom = new JSDOM(`<!DOCTYPE html><head></head><body></body>`);
const document = dom.window.document;

var dataPath = path.join(__dirname, "../testSupport/titanic.tsv");
var titanic = fs.readFileSync(dataPath, "utf8");
const testData = tsvParse(titanic);
const dispersionMapping = {
  x: {
    value: ["Age"],
  },
  y: {
    value: "Fare",
  },
};

describe("raw", () => {
  it("should be hello raw", () => {
    const viz = rawChart(testChart, {
      data: testData,
      mapping: dispersionMapping,
      //dataTypes: some,
      visualOptions: {},
    });

    const { optionsConfig, optionsValues } = viz._getOptions();
    console.log(optionsConfig);
    console.log(optionsValues);

    const div = document.createElement("div");
    viz.renderToDOM(div);
  });

  it("should be hello raw", () => {});
});
