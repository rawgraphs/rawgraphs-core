---
id: data-parsing
title: Data parsing
sidebar_label: Data parsing
slug: /data-parsing
---

User data is the entry point of the RAWGraphs workflow, and the rawgraphs-core library introduces some concepts and utilities
to deal with user provided datasets.

RAWGraphs works on a tabular dataset, that will be transformed internally according to the chart type we want to draw.

The task of importing such kind of dataset from common formats like csv into javascript is already solved by other libraries
(we use [d3-dsv](https://github.com/d3/d3-dsv) in the RAWGraphs app), but as we normally work with text-based data formats,
we also must define the data types of the different columns.

For example in this csv dataset:

```csv
year, orders, total, client
2000, 100, 1000, A and Co.
2001, 10, 2000, M and Co.
2002, 30, 300, C and Co.
```

all data points and values are formally strings, but the column `year` could be paresed as a date, and the columns `orders` and `total`
are numbers.

## Data Types in RAWGraphs

RAWGraphs has the concept of **data type** and can handle **strings**, **number** and **dates**.

When handling a user dataset, it is required that each data column in the tabular dataset has the same data type for all
the data points.

When we create an instance of a rawgraphs chart you have the ability to declare the datatypes of the columns in the dataset,
otherwise raw will infer them from the dataset.
Given a set of column, its datatypes are expressed as an object where keys are the names of columns and values a- one of "number", "date", or "string".

For example:

```js
const dataTypes = {
  age: "number",
  height: "number",
  born: "date",
  name: "string",
}
```

Let's go back to the basic example of rendering a chart:

```js
// 1. imports: chart factory function and chart implementation
import { chart } from '@rawgraphs/rawgraphs-core'
import { bubblechart } from '@rawgraphs/rawgraphs-charts'

// 2. defining data
const data = [{age:10, height:130}, {age:18, height:170}]

// 3. defining mapping
const mapping = { x: { value: 'age' }, y: { value: 'height' } }

// 4. creating a chart instance
const viz = new chart(bubblechart { data,  mapping})

// 5. rendering to the DOM
const targetNode = document.getElementById('some-div')
viz.renderToDOM(targetNode)
```

As you can see there's no mentioning of datatypes, but under the hood rawgraphs has been able to
identify the "age" and "height" columns in the dataset. In this case this is important as the bubblechart
only accepts numbers or dates on the `x` dimension and numbers on the `y` dimensions.

We could have been more verbose, by specifying the datatypes:

```js
// 1. imports: chart factory function and chart implementation
import { chart } from '@rawgraphs/rawgraphs-core'
import { bubblechart } from '@rawgraphs/rawgraphs-charts'

// 2. defining data and data types
const data = [{age:10, height:130}, {age:18, height:170}]
const dataTypes = {
    age: "number",
    height: "number",
}

// 3. defining mapping
const mapping = { x: { value: 'age' }, y: { value: 'height' } }

// 4. creating a chart instance
const viz = new chart(bubblechart { data,  dataTypes, mapping})

// 5. rendering to the DOM
const targetNode = document.getElementById('some-div')
viz.renderToDOM(targetNode)
```

In this way you can "force" the visualization to use your explicit data types.

## "Real-world" data and data types inference

When dealing with real-world datasets, we often start from spreadsheets, text files, database exports, copy and paste,
that come with no information about data types, and are often "formatted" with conventions based on language
and culture of who produced the data.

An obvious case is related to dates formats, which standard change from nation to nation, or that can be
expressed with a mixture of words and numbers (ex: Jan 2021), specify date and time (ex: 2021-01-01 18:00:00), date only (ex: 2021-01-01) or just a part of it (ex: 2021).

Another case is number formatting, where the dot `.` or the comma `,` sign are used as decimal separators in different languages.

RAWGraphs includes some functions used in the RAWGraphs app to solve this problem for the, with the `inferTypes` and `parseDataset` functions.
These utilities are used in the "Data loading" section of the app.

`inferTypes`
-----------

This function can be used to detect the data types of a dataset. The signature is the following

### inferTypes(data, parsingOptions) ⇒ [<code>DataTypes</code>](#DataTypes)

- The `data` parameter is the array of objects that must be parsed
- The `parsingOptions` is an optional objects with the following properties:

| Name       | Type                              | Description                                                                                  |
| ---------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| strict     | <code>boolean</code>              | if strict is false, a JSON parsing of the values is tried. (if strict=false: "true" -> true) |
| locale     | <code>string</code>               |                                                                                              |
| decimal    | <code>string</code>               |                                                                                              |
| group      | <code>string</code>               |                                                                                              |
| numerals   | <code>Array.&lt;string&gt;</code> |                                                                                              |
| dateLocale | <code>string</code>               |                                                                                              |

The return value of the function is an object representing the guessed **data types**.
Its shape is described in the [api docs](api#datatypes--objectnumberstringdatedatatypeobject)

and extends the datatypes definition of RAWGraphs by allowing to specify custom properties for the different data types.
For example, the `date` format allows to specify a `dateFormat` property.

**Example of datatypes**

```js
{ x: 'number', y: { type: 'date', dateFormat: 'DD-MM-YYYY } }
```

:::info
The `dateFormat` property in each data type definition plays a role similar to the options available in the `parsingOptions`
parameter, the only difference is that the date format may be specified for each column, while the numeric formatting is
global. This reflects the actual user interface of the RAWGraphs app.
:::

Let's see how the function is used:

**inferTypes example**

```js
import { inferTypes } from "@rawgraphs/rawgraphs-core"
const data = [
  { a: 1, b: "2021" },
  { a: 2000, b: "2011" },
  { a: 1, b: "2000" },
]
const detectedTypes = inferTypes(data)

// the value of detectedTypes is
// {a: "number", b: "number"}
```

As you can see, even if the `b` column of our dataset is formally a string, the library was able to cast it to numbers.

:::info
For each column, Rawgraphs tries to cast each datum to each data type. If the majority of data points can be casted to a type,
that type is chosen for the column.
:::

Let's see a couple more of examples. The function is able to detect ISO dates formats:

```js
import { inferTypes } from "@rawgraphs/rawgraphs-core"
const data = [
  { a: 1, b: "2021-01-01" },
  { a: 2000, b: "2011-01-01" },
  { a: 1, b: "2000-02-02" },
]
const detectedTypes = inferTypes(data)

// the value of detectedTypes is
// {a: "number", b: {type: "date", dateFormat: "YYYY-MM-DD"}}
```

And we can use the `parsingOption` parameter for specifying that the comma is the decimal separator:

```js
import { inferTypes } from "@rawgraphs/rawgraphs-core"
const data = [
  { a: 1, b: "1,2" },
  { a: 2000, b: "3,1" },
  { a: 1, b: "2,2" },
]
const detectedTypes = inferTypes(data, { decimal: "," })

// the value of detectedTypes is
// {
//    a: {
//      type: "number"
//      locale: undefined
//      decimal: ","
//      group: ""
//      numerals: Array(10) ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
//    },
//   b: {
//     type: "number"
//     locale: undefined
//     decimal: ","
//     group: ""
//     numerals: Array(10) ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
//   }
// }
```

:::info
The function `inferTypes` limits its search for data types to numbers with `.` as decimal separator, dates and datetimes in ISO format,
but doesn't explore all the possible date formats and formatting options.
:::

`parseDataset`
-------------

This function can be used to parse a "formatted" dataset, already split in row and columns, and has the following syntax:

### parseDataset(data, [types], [parsingOptions]) ⇒ [<code>ParserResult</code>](api#parserresult--object)


- The `data` parameter is the array of objects that must be parsed
- The `types` is an optional object specifying the types we want to enforce, with the same syntax of the dataTypes output described for the `inferTypes` function
- The `parsingOptions` (optional) is the same object described for the `inferTypes` function.

Note that in case we don't pass the `types` parameter, the library will try and detect types automatically using the `inferTypes` function described above,
and if no datatype can be detected for a column, the library will recognize it as a simple string.

The function returns an object with three properties:

- `dataset`: the set of rows that could be parsed
- `dataTypes`: the datatypes used for parsing
- `errors`: errors that prevented from parsing rows according to dataTypes

**Examples**

Let's try and parse a dataset with some values changing type in the different rows.
We won't specify any "hint" for data types and no parsing options.

```js
import { parseDataset } from "@rawgraphs/rawgraphs-core"

const data = [
  { a: 1, b: "3" },
  { a: 2, b: 2 },
  { a: 1, b: "3" },
]
const { dataset, dataTypes, errors } = parseDataset(data)

// will return
//
// dataset -> [{a: 1, b: "hello"}, {a: 2, b: "2"}, {a: 1, b: "3"}]
// dataTypes: {a: "number", b: "number" }
// errors -> []
```

Here's an example of parsing dates with some parsing errors:

```js
import { parseDataset } from '@rawgraphs/rawgraphs-core'
const data = [{a: 1, b: "2001-01-01"}, {a: 2000, b: "2001-02-02"}, {a: 1, b: "no data"}]
const { dataset, dataTypes, errors } = parseDataset(data)

// result = Object {
//  dataset: Array(3) [
//   0: Object {a: 1, b: 2001-01-01T00:00}
//   1: Object {a: 2000, b: 2001-02-02T00:00}
//   2: Object {a: 1, b: undefined}
//  ],
//  dataTypes: Object {
//   a: "number"
//   b: Object {type: "date", dateFormat: "YYYY-MM-DD"}
//  }
//  errors: Array(1) [
//   0: Object {row: 2, error: Object}
//  ]


```

In this case the library has been able to detect the `b` column as ISO date, but could just parse correctly 2 of 3 records in the dataset, and the array
of errors contains information about the row and column that could not be parsed.

Values that cannot be parsed with the specified type become `undefined` in the parsed dataset.
