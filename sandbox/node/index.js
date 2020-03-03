import {raw} from '../../src';
import {JSDOM} from "jsdom";
import {select} from 'd3-selection'

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



const visualModel = {

  getDimensions : function(){
    return {

      x : {
        types: [Number, Date],
        required: true,
      },

      y : {
        types: [Number, Date],
        required: true,
      },

      size: {
        types: [Number],
      },

      color: {
        types: [Number, Date, String],
      },

      label: {
        types: [Number, Date, String],
      }


    }


  },

  render: function(node, data, options) {

    const selection = select(node)
    selection.append('g')
    
  }


}


const viz = raw(visualModel)
viz.renderToDOM(div)
console.log(div.innerHTML)

