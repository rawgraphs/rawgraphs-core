import { RAWError } from "./utils";
import { getAggregator } from "./expressionRegister";
import difference from "lodash/difference";
import pick from "lodash/pick";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import flatten from "lodash/flatten";
import keyBy from "lodash/keyBy";
import find from "lodash/find";
import range from "lodash/range";
import { group, groups, rollup, rollups } from "d3-array";

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

  const getters = dimensions.filter((d) => d.operation === "get");
  let rollupDimension = dimensions.filter((d) => d.operation === "rollup" || d.operation === "rollups" );
  if (rollupDimension.length > 1) {
    throw new RAWError("only one rollup dimension is allowed");
  }

  if (getters.length === 0 && !rollupDimension.length) {
    throw new RAWError(
      "at least one get operation must be present in a dimension set, or a rollup(s) operation must be specified"
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

export function validateMapping(dimensions, mapping) {
  // validating that all required dimensions are provided to mapping
  const requiredDimensions = dimensions
    .filter((d) => d.required)
    .map((d) => d.name)
    .sort();
  const providedDimensions = Object.keys(mapping)
    .filter((k) => get(mapping[k], "value"))
    .sort();
  const missing = difference(requiredDimensions, providedDimensions);
  if (missing.length > 0) {
    throw new RAWError(
      `Some required dimensions were not mapped: ${missing.join(", ")}`
    );
  }

  // #TODO: [future] if using registered functions check for existence
  // #TODO: [future] if using expressions check for existence
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

//#TODO function that validates the mapper definition
/*

  - one "group" operation at maximun
  - one "groupAggregate" operation at maximun
  - if "groupAggregate" is present, only named columns can be used to get data

*/
function validateMapperDefinition(mapperDef) {
  //....
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

  if (types) {
    validateTypes(dimensions, mapping, types);
  }

  const dimensionsById = keyBy(dimensions, "id");

  const mappingValues = mapValues(mapping, (v) => v.value);
  const mappingConfigs = mapValues(mapping, (v) => get(v, "config"));

  const getDimensions = dimensions
    .filter((d) => d.operation === "get" && mappingValues[d.id] !== undefined)
    .map((g) => g.id);

  const groupAggregateDimension = get(
    find(
      dimensions,
      (d) =>
        d.operation === "groupAggregate" && mappingValues[d.id] !== undefined
    ),
    "id"
  );

  const groupByDimension = get(
    find(
      dimensions,
      (d) => d.operation === "groupBy" && mappingValues[d.id] !== undefined
    ),
    "id"
  );
  const groupDimension = get(
    find(
      dimensions,
      (d) => d.operation === "group" && mappingValues[d.id] !== undefined
    ),
    "id"
  );
  const groupsDimension = get(
    find(
      dimensions,
      (d) => d.operation === "groups" && mappingValues[d.id] !== undefined
    ),
    "id"
  );

  const rollupDimension = get(
    find(
      dimensions,
      (d) => d.operation === "rollup" && mappingValues[d.id] !== undefined
    ),
    "id"
  );

  const rollupsDimension = get(
    find(
      dimensions,
      (d) => d.operation === "rollups" && mappingValues[d.id] !== undefined
    ),
    "id"
  );


  //#TODO ... is this still needed?
  const hierarchyDimension = get(
    find(
      dimensions,
      (d) => d.operation === "hierarchy" && mappingValues[d.id] !== undefined
    ),
    "id"
  );

  //#TODO: TAKE IN ACCOUNT GROUP AGGREGATE DUE TO FORMATS
  const formatAggregateDimensions = getDimensions.filter((id) =>
    get(mappingConfigs[id], "format")
  );

  const candidateGroupers = [
    groupByDimension,
    groupDimension,
    groupsDimension,
    rollupDimension,
    rollupsDimension,
  ].filter((x) => !!x);
  if (candidateGroupers.length > 1) {
    throw new RAWError(
      "only one of these operations is allowed in a mapper definition: 'group', 'groups', 'groupBy', 'rollup', 'rollups'"
    );
  }

  let grouperDimension;
  if (candidateGroupers.length) {
    grouperDimension = candidateGroupers[0];
  }

  const rollupGrouperDimension = rollupDimension || rollupsDimension
        

  return function (data) {
    let tabularData;

    //apply grouping operations if any
    if (groupAggregateDimension) {
      // #todo: this is complex. allow only strings in this case
      const identifiers = flatten([mappingValues[groupAggregateDimension]]);

      const dataGroups = groupBy(data, (row) => {
        const labelPieces = identifiers.map((x) => get(row, x));
        return JSON.stringify(labelPieces);
      });

      tabularData = Object.keys(dataGroups).map((label) => {
        let item = {};
        const group = dataGroups[label];

        item[groupAggregateDimension] = JSON.parse(label);
        if (item[groupAggregateDimension].length === 1) {
          item[groupAggregateDimension] = item[groupAggregateDimension][0];
        }

        getDimensions.forEach((getter) => {
          const getterColumn = mappingValues[getter];
          //#GET HERE
          const allData = group.map((d) => get(d, getterColumn));
          const getterInAggregator = identifiers.indexOf(getterColumn) !== -1;
          const aggregator = get(
            mappingConfigs[getter],
            "aggregation",
            getterInAggregator ? (data) => data[0] : (data) => data.length
          );
          const aggregatorFunction = getAggregator(aggregator);
          item[getter] = aggregatorFunction(allData);
        });
        if (groupDimension || groupsDimension) {
          if (Array.isArray(mappingValues[groupDimension])) {
            item[groupDimension] = mappingValues[groupDimension].map((v) =>
              get(group[0], v)
            );
          } else {
            item[groupDimension] = get(group[0], mappingValues[groupDimension]);
          }
        }

        return item;
      });
    } else {
      tabularData = data.map((row) => {
        let item = {};
        getDimensions.forEach((id) => {
          //#GET HERE
          item[id] = get(row, mappingValues[id]);
        });
        if (grouperDimension && mappingValues[grouperDimension]) {
          if (Array.isArray(mappingValues[grouperDimension])) {
            item[grouperDimension] = mappingValues[grouperDimension].map((v) =>
              get(row, v)
            );
          } else {
            item[grouperDimension] = get(row, mappingValues[grouperDimension]);
          }
        }

        //getter for rollup aggregation
        if (rollupGrouperDimension && mappingConfigs[rollupGrouperDimension]) {
          const rollupConfigAggregationTarget = get(
            mappingConfigs,
            `[${rollupGrouperDimension}].leafAggregation[1]`
          );
          item[rollupConfigAggregationTarget] = get(row, rollupConfigAggregationTarget)
        }

        return item;
      });
    }

    //#TODO
    //apply hierarchy operation if any
    // if (hierarchyDimension) {
    //   // ...
    // }

    if (grouperDimension) {
      if (groupByDimension) {
        return groupBy(tabularData, groupByDimension);
      }

      const grouperDims = Array.isArray(mappingValues[grouperDimension])
        ? mappingValues[grouperDimension]
        : [mappingValues[grouperDimension]];
      const grouperGetters = range(grouperDims.length).map((idx) => (item) =>
        item[grouperDimension][idx]
      );

      if (groupDimension) {
        return group(tabularData, ...grouperGetters);
      }
      if (groupsDimension) {
        return groups(tabularData, ...grouperGetters);
      }

      if (rollupGrouperDimension) {
        const rollupConfigAggregation = get(
          mappingConfigs,
          `[${rollupGrouperDimension}].leafAggregation`
        );
        
        
        let rollupAggregation = v => v.length
        if(rollupConfigAggregation){
          if(!Array.isArray(rollupConfigAggregation) || rollupConfigAggregation.length !== 2){
            throw new RAWError("Rollup aggregation should be an array with aggregation function and target column")
          }
          const [aggName, targetColumn] = rollupConfigAggregation
          const aggregatorFunction = getAggregator(aggName);
          const leafGetter = item => get(item, targetColumn)
          const wrappedAggregatorFunction = (items) => {
            return aggregatorFunction(items.map(leafGetter));}

          rollupAggregation = wrappedAggregatorFunction

        }
        
        
        const finalRollupFunction = rollupDimension ? rollup: rollups
        return finalRollupFunction(
          tabularData,
          rollupAggregation,
          ...grouperGetters
        );
      }
    }

    return tabularData;
  };
}

export default mapper;
