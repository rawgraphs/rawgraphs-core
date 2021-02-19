import { chart } from "../../src";
import testChart from "../../src/testSupport/chart";
import { tsvParse } from "d3-dsv";
import { JSDOM } from "jsdom";
import fs from "fs";

var titanic = fs.readFileSync("data/titanic.tsv", "utf8");

const dom = new JSDOM(`<!DOCTYPE html><head></head><body></body>`);
const document = dom.window.document;

//hack for generating valid svgs with jsdom
const createElementNS = document.createElementNS.bind(document);
document.createElementNS = (ns, name) => {
  const o = createElementNS(ns, name);
  o.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return o;
};

const div = document.createElement("div");

const testData = tsvParse(titanic);

const dispersionMapping = {
  x: {
    value: ["Age"],
  },
  y: {
    value: "Fare",
  },
};

const viz = chart(testChart, {
  data: testData,
  mapping: dispersionMapping,
});
viz.renderToDOM(div);

fs.writeFileSync("test.svg", div.innerHTML);
