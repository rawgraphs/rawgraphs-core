import { RAWError } from "./utils";
import mean from 'lodash/mean'
import max from 'lodash/max'
import min from 'lodash/min'
import sum from 'lodash/sum'
import first from 'lodash/first'
import last from 'lodash/last'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import uniq from 'lodash/uniq'
import range from "lodash/range";
import get from "lodash/get";

const aggregationsRegister = {}

export function registerAggregation(name, fun){
  aggregationsRegister[name] = fun
}

export function unregisterAggregation(name){
  delete aggregationsRegister[name]
  
}

export function getAggregatorNames(){
  return Object.keys(aggregationsRegister)
}

export function getAggregator(aggregatorExpression){
  if(isFunction(aggregatorExpression)){
    return aggregatorExpression
  }

  if(isString(aggregatorExpression)){
    if(aggregationsRegister[aggregatorExpression]){
      return aggregationsRegister[aggregatorExpression]
    } else {
      throw new RAWError(`Aggregator "${aggregatorExpression}" is is not registered in RAW.`)
    }
  }

}


export function getAggregatorArray(aggregator, length){
  
  return function(items){
    return range(length).map(idx => {
      const aggregatorExpression = Array.isArray(aggregator) ? get(aggregator, idx, aggregator[0]) : aggregator
      const aggr = getAggregator(aggregatorExpression)
      return aggr(items.map(i => i[idx]))
    })
  }

}

// Aggregators available in RAW
// general purpose
registerAggregation("count", items => items.length)
registerAggregation("last", last)
registerAggregation("first", first)
registerAggregation("countDistinct", items => uniq(items).length)

// numbers
registerAggregation("mean", mean)
registerAggregation("max", max)
registerAggregation("min", min)
registerAggregation("sum", sum)

//string
const commaSeparated = items => items.join(",")
const tabSeparated = items => items.join("\t")
const newLineSeparated = items => items.join("\n")
const itemsList = items => items
const itemsUniq = items => uniq(items)

registerAggregation("csv", commaSeparated)
registerAggregation("csvDistinct", items => commaSeparated(uniq(items)))
registerAggregation("commaSeparated", commaSeparated)
registerAggregation("tsv", tabSeparated)
registerAggregation("tsvDistinct", items => tabSeparated(uniq(items)))
registerAggregation("tabSeparated", tabSeparated)
registerAggregation("newLineSeparated", newLineSeparated)
registerAggregation("list", itemsList)
registerAggregation("distinct", itemsUniq)