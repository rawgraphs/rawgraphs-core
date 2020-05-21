import {raw} from '../../src';
import testChart from '../../src/testChart';
import { tsvParse } from 'd3-dsv'
import {JSDOM} from "jsdom";

import fs from 'fs'

var titanic = fs.readFileSync('data/titanic.tsv', "utf8")

const dom = new JSDOM(`<!DOCTYPE html><head></head><body></body>`);
const document = dom.window.document;
const div = document.createElement("div");
// document.body.append(div);

const testData = tsvParse(titanic)


const dispersionMapping = {
  x: {
    value: 'Age'
  },
  y: {
    value: 'Fare'
  }

}


const viz = raw(testChart, {
  data: testData,
  mapping: dispersionMapping,
  //dataTypes: some,
  //visualOptions: {}
})
viz.renderToDOM(div)


fs.writeFileSync("test.svg", div.innerHTML);
