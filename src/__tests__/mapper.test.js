import fs from 'fs'
import makeMapper from '../mapping'
import { tsvParse } from 'd3-dsv'
import { RAWError } from '../utils'

var titanic = fs.readFileSync('data/titanic.tsv', "utf8")

const x = {
  id: 'x',
  name: 'x',
  validTypes: ["number", "date"],
  required: true,
  operation: 'get',

}

const y = {
  id: 'y',
  name: 'y',
  validTypes: ["number", "date"],
  required: true,
  operation: 'get',

}

const groupAgg = {
  id: 'groupAgg',
  name: 'groupAgg',
  validTypes: ["number", "date"],
  required: true,
  operation: 'groupAggregate',
  multiple: true,

}

const group = {
  id: 'group',
  name: 'group',
  validTypes: ["number", "date"],
  required: true,
  operation: 'group',
  multiple: true,
}


const dispersionDimensions = [x, y]
const groupAggregateDimensions = [groupAgg, x, y]
const groupDimensions = [group, x, y]

const testData = tsvParse(titanic)


const dispersionMapping = {
  x: {
    value: 'Age'
  },
  y: {
    value: 'Fare'
  },

}

const groupAggregateMapping = {
  x: {
    value: 'Fare',
    config: {
      // aggregation: rows => mean(rows.map(x => +x))
      aggregation: 'mean',
    }
  },
  y: {
    value: 'Age',
  },
  groupAgg: {
    value: ['Gender', 'Destination']
  },

}

const groupMapping = {
  x: {
    value: 'Age'
  },
  y: {
    value: 'Fare'
  },
  group: {
    value: ['Gender', 'Destination']
  },

}


describe('makeMapper', () => {
  it('should perform some mappings', () => {

    const mappingFunctionDispersion = makeMapper(dispersionDimensions, dispersionMapping )
    const mappedDataDispersion = mappingFunctionDispersion(testData)

    // console.log(mappedDataDispersion)

    const mappingFunctionGroupAggregate = makeMapper(groupAggregateDimensions, groupAggregateMapping )
    const mappedDataGroupAggregate = mappingFunctionGroupAggregate(testData)

    // console.log(mappedDataGroupAggregate)

    const mappingFunctionGroup = makeMapper(groupDimensions, groupMapping )
    const mappedDataGroup = mappingFunctionGroup(testData)

  })


  it('throw an error if a required dimension is not set', () => {
    const requiredException = {
      y: {
        value: 'Fare'
      },
      group: {
        value: ['Gender', 'Destination']
      },
    
    }
    expect(() => { makeMapper(groupDimensions, requiredException)}).toThrow(RAWError);
  })

  it('throw an error if multiple is not set on dimension x', () => {
    const groupMultipleException = {
      x: {
        value: ['Age', 'Fare']
      },
      y: {
        value: 'Fare'
      },
      group: {
        value: ['Gender', 'Destination']
      },
    
    }
    expect(() => { makeMapper(groupDimensions, groupMultipleException)}).toThrow(RAWError);
  })

  it('throw an error if minValues and maxValues are not ok', () => {

    const testMappingMinMax = [{
      id: 'x',
      name: 'x',
      validTypes: ["number", "date"],
      required: true,
      operation: 'get',
      multiple: true,
      minValues: 3,
      maxValues: 4,
    }]

    const testMappingMinMaxExceptionMin = {
      x: {
        value: ['Gender', 'Destination']
      },
    
    }
    expect(() => { makeMapper(testMappingMinMax, testMappingMinMaxExceptionMin)}).toThrow(RAWError);

    const testMappingMinMaxExceptionMax = {
      x: {
        value: ['Gender', 'Destination', 'Age', 'Fare', 'Survival']
      },
    
    }
    expect(() => { makeMapper(testMappingMinMax, testMappingMinMaxExceptionMax)}).toThrow(RAWError);

  })

  
}) 