---
id: declarative-mapping
title: Declarative mapping
sidebar_label: Declarative mapping
slug: /declarative-mapping
---

As described in the [chart interface page](chart-interface.md) each chart implementation must define a 
`mapData` function that prepares the dataset for the rendering.

Each chart might need a different shape of data, but it's possible to identify some common patterns for transforming data.
For this purpose, we're introducing a "declarative mapping" approach, in which the rawgraphs chart interface can implement the `mapData`
as a plain object describing the "role" of each dimension in the data transformation.


:::caution

This API is still under definition and might change in the future versions.

:::



## Simple column picking

This form of declarative mapping implements the operation of "translating" column names
from the user dataset to the dimensions described in the charts.

Let's suppose we have a dataset like:

```
height, color, weight, specie
10,red,10,A
12,red,20,A
12,violet,10,B
14,violet,10,C
10,red,10,A
```

and a chart exposing two dimensions:

```js
const chart = {
    ...
    dimensions: [
        { 
            id: 'x',
            label: 'x',
            required: 'true',
        },
        { 
            id: 'y',
            label: 'y',
            required: 'true',
        },
    ],
    ...

}
```

If we just want to "reduce" the dataset to a list of `x` and `y` based on column mappings,
the `mapData` function could be written like

```js
const chart = {
    ...
    mapData: function (data, mapping, dataTypes, dimensions) {
    return data.map((item) => ({
      x: item[mapping.x.value],
      y: item[mapping.y.value],
    }));
  },
  ...
}
```

Using the declarative mapping, we can just write:

```js
const chart = {
    ...
    mapData: {
        x: "get",
        y: "get",
    }
  },
  ...
}
```

Which tells RAWGraphs to just pick the two columns mapped on x and y dimensions.
Note that this implementation would also work for multi-valued dimensions, while the function shown above 
would not work in this case.

:::info

You can see an example of this kind of mapping in the [core bubble chart](https://github.com/rawgraphs/rawgraphs-charts/blob/master/src/bubblechart/mapping.js)
used in the RAWGraphs app.
:::



