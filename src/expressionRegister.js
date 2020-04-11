import { RAWError } from "./utils";
import mean from 'lodash/mean'
import max from 'lodash/max'
import min from 'lodash/min'
import sum from 'lodash/sum'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'

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
// numbers
registerAggregation("mean", mean)
registerAggregation("max", max)
registerAggregation("min", min)
registerAggregation("sum", sum)

//string
