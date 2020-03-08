import {raw} from '../../src';
import testChart from '../../src/testChart';

import {JSDOM} from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><head></head><body></body>`);
const document = dom.window.document;
const div = document.createElement("div");
// document.body.append(div);


//example... to be reworked..
const group = {
  
  type: [Number, String, Date],
  multiple: true,
  
  required: true,
  numValuesMin: 1,
  numValuesMax: 3,

  reduce: null,
  map: null,
  order: 0,
};




const viz = raw(testChart)
viz.renderToDOM(div)
console.log(div.innerHTML)

