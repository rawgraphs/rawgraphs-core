import { RAWError } from "./utils";
import difference from "lodash/difference";
import pick from "lodash/pick";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import flatten from "lodash/flatten";
import keyBy from "lodash/keyBy";
import find from "lodash/find";


/**
 * dimensions validator
 *
 * @param {array} dimensions
 */

function validateDimensions(dimensions) {
  if (!Array.isArray(dimensions)) {
    throw new RAWError("dimesions must be an array");
  }

  if (dimensions.length === 0) {
    throw new RAWError("empty dimensions");
  }

  const getters = dimensions.filter(d => d.operation === "get");
  if (getters.length === 0) {
    throw new RAWError(
      "at least one get operation must be present in a dimension set"
    );
  }
}

/**
 * mapping validator
 *
 * @param {array} dimensions
 * @param {object} mapping
 * 
 */

function validateMapping(dimensions, mapping) {
  // validating that all required dimensions are provided to mapping
  const requiredDimensions = dimensions
    .filter(d => d.required)
    .map(d => d.name)
    .sort();
  const providedDimensions = Object.keys(mapping).filter(k => get(mapping[k], 'value')).sort();
  const missing = difference(requiredDimensions, providedDimensions);
  if (missing.length > 0) {
    throw new RAWError(
      `Some required dimensions were not mapped: ${missing.join(", ")}`
    );
  }
}

/**
 * validateTypes validator
 *
 * @param {array} dimensions
 * @param {array} types
 * 
 */

function validateTypes(dimensions, mapping, types) {
  // #TODO validate that all dimesions are mapped to correct types
}


/**
 * mapper generator
 *
 * @param {array} dimensions
 * @param {object} mapping
 * @return {function} the mapper function
 */

function mapper(dimensions, mapping, types) {
  validateDimensions(dimensions);
  validateMapping(dimensions, mapping);

  if(types){
    validateTypes(dimensions, mapping, types);
  }

  const dimensionsById = keyBy(dimensions, "id");

  const mappingValues = mapValues(mapping, v => v.value);
  const mappingConfigs = mapValues(mapping, v => get(v, "config"));

  const getDimensions = dimensions
    .filter(d => d.operation === "get" && mappingValues[d.id] !== undefined)
    .map(g => g.id);
  
    const groupAggregateDimension = get(
    find(dimensions, d => d.operation === "groupAggregate" && mappingValues[d.id] !== undefined),
    "id"
  );
  const groupDimension = get(
    find(dimensions, d => d.operation === "group" && mappingValues[d.id] !== undefined),
    "id"
  );
  const hierarchyDimension = get(
    find(dimensions, d => d.operation === "hierarchy" && mappingValues[d.id] !== undefined),
    "id"
  );


  

  //#TODO: TAKE IN ACCOUNT GROUP AGGREGATE DUE TO FORMATS
  const formatAggregateDimensions = getDimensions.filter(id =>
    get(mappingConfigs[id], "format")
  );
   
  

  return function(data) {

    let tabularData;

    //apply grouping operations if any
    if (groupAggregateDimension) {
      const identifiers = flatten([mappingValues[groupAggregateDimension]])

      const dataGroups = groupBy(data, row => {
        const labelPieces = identifiers.map(x => get(row, x));
        return JSON.stringify(labelPieces)
      });

      tabularData = Object.keys(dataGroups).map(label => {
        let item = {}
        const group = dataGroups[label]
        // console.log("identifiers", identifiers)
        // identifiers.forEach(id => {
        //   item[id] = get(group[0], id)
        // })

        item[groupAggregateDimension] = JSON.parse(label)
        if(item[groupAggregateDimension].length === 1){
          item[groupAggregateDimension] = item[groupAggregateDimension][0]
        }

        getDimensions.forEach(getter => {
          const getterColumn = mappingValues[getter]
          
          const allData = group.map(d => get(d, getterColumn));
          const getterInAggregator = identifiers.indexOf(getterColumn) !== -1
          const aggregator = get(
            mappingConfigs[getter],
            "aggregation",
            getterInAggregator ? data => data[0] : data => data.length
          );
          item[getter] = aggregator(allData);
        });
        if(groupDimension){
          item[groupDimension] = get(group[0], mappingValues[groupDimension])
        }


        return item;
      });
    } else {

      tabularData = data.map(row => {
        let item = {}
        getDimensions.forEach(id => {
          item[id] = get(row, mappingValues[id])
        })
        if(groupDimension && mappingValues[groupDimension]){
          item[groupDimension] = get(row, mappingValues[groupDimension])
        }
        return item
      });
    }

   
    //#TODO
    //apply hierarchy operation if any
    if (hierarchyDimension) {
      // ...
    }

    if (groupDimension) {
      return groupBy(tabularData, groupDimension);
    }

    return tabularData;
  };
}

export default mapper;
