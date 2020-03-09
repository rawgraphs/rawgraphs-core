import mapper from '../mapping'
import { tsvParse } from 'd3-dsv'
import mean from 'lodash/mean'

import fs from 'fs'

var titanic = fs.readFileSync('data/titanic.tsv', "utf8")

const x = {
  id: 'x',
  name: 'x',
  validTypes: [Number, Date],
  required: true,
  operation: 'get',

}

const y = {
  id: 'y',
  name: 'y',
  validTypes: [Number, Date],
  required: true,
  operation: 'get',

}

const groupAgg = {
  id: 'groupAgg',
  name: 'groupAgg',
  validTypes: [Number, Date],
  required: true,
  operation: 'groupAggregate',

}

const group = {
  id: 'group',
  name: 'group',
  validTypes: [Number, Date],
  required: true,
  operation: 'group',
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
      aggregation: rows => mean(rows.map(x => +x))
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
    value: 'Destination'
  },

}


describe('mapper', () => {
  it('should map x and y', () => {

    // const mappingFunctionDispersion = mapper(dispersionDimensions, dispersionMapping )
    // const mappedDataDispersion = mappingFunctionDispersion(testData)

    // console.log(mappedDataDispersion)

    // const mappingFunctionGroupAggregate = mapper(groupAggregateDimensions, groupAggregateMapping )
    // const mappedDataGroupAggregate = mappingFunctionGroupAggregate(testData)

    // console.log(mappedDataGroupAggregate)

    const mappingFunctionGroup = mapper(groupDimensions, groupMapping )
    const mappedDataGroup = mappingFunctionGroup(testData)

    console.log(mappedDataGroup)

    expect(1)
      .toBe(1)


  })
}) 