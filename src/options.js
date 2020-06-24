// Options module
// Validation 
// Generation of default object

import { RAWError } from './utils'
import mapValues from 'lodash/mapValues'


const inputTypeToOptions = {
  
  text:  {
    minLength: null,
    maxLength: null,
    options: null,
  },

  number : {
    step: 'any',
    min: null,
    max: null,
    options: null,
  },

  range: {
    step: 'any',
    min: 0,
    max: 1,
  },

  color : {
    options: null,
  },

  colorScale: {
    dimension: null,
  },

  boolean : {
  
  },

  //#TODO: makes sense?
  // margins: {
    
  // },


}



function validateText(def, value){

}

function validateNumber(def, value){
  
}

function validateRange(def, value){
  
}

function validateColor(def, value){
  
}

function validateColorScale(def, value){
  
}


function validateBoolean(def, value){
  
}


const validators = {
  text: validateText,
  number: validateNumber,
  range: validateRange,
  color: validateColor,
  colorScale: validateColorScale,
  boolean: validateBoolean,
}


export function validateOptionsDefinition(definition){


}

export function getDefaultOptions(definition){
  return mapValues(definition, field => field.default)
}

export function getOptions(definition, values){
  const opts = getDefaultOptions(definition)
  return {
    ...opts,
    ...values,
  }
}


export function validateValues(definition, values){

  

}

export function getEnabledOptions(definition, values){
  

}



