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

const aggregationsRegister = {}

export function registerAggregation(name, fun){
  aggregationsRegister[name] = fun
}

export function unregisterAggregation(name){
  delete aggregationsRegister[name]
  
}

export function getAggregator(aggregator){
  if(isFunction(aggregator)){
    return aggregator
  }

  if(isString(aggregator)){
    if(aggregationsRegister[aggregator]){
      return aggregationsRegister[aggregator]
    } else {
      throw new RAWError(`Aggregator "${aggregator}" is is not registered in RAW.`)
    }
  }

}

// Aggregators available in RAW
// general purpose
registerAggregation("last", last)
registerAggregation("first", first)
registerAggregation("count", items => items.length)
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

registerAggregation("csv", commaSeparated)
registerAggregation("csvDistinct", items => commaSeparated(uniq(items)))
registerAggregation("commaSeparated", commaSeparated)
registerAggregation("tsv", tabSeparated)
registerAggregation("tsvDistinct", items => tabSeparated(uniq(items)))
registerAggregation("tabSeparated", tabSeparated)
registerAggregation("newLineSeparated", newLineSeparated)