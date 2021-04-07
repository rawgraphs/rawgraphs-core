---
id: example-npm
title: Quick example (npm)
sidebar_label: Quick example (npm)
slug: /example-npm
---

Here's a super-quick example of using the rawgraphs from javascript code.

In this case we'll assume we're using `yarn` to install the package from npm. Refer to 
[installation](install.md) for other options.

See the [live demo](#live-demo) at the end of the page for a complete example.


## Installation

```bash
yarn add @rawgraphs/rawgraphs-core
```


## Install some charts

To do something useful with rawgraphs-core, we'll need some charts as well.
Let's use the charts from the rawgraphs-charts package.

```bash
yarn add @rawgraphs/rawgraphs-charts
```

## Rendering a bubblechart

In this example we'll build a bubblechart from the @rawgraphs/rawgraphs-core repository.
We'll assume a basic html structure like the following

```html
<!DOCTYPE html>
<html>

<body>
  <!-- this is the "target" of the rawgraphs chart -->
	<div id="app"></div>
  
  <!-- this is the script where we'll do the rendering -->
  <script src="src/index.js">
	</script>
</body>

</html>
```


The chart will be renderend by javascript code in the `index.js`: 



```js
import { chart } from "@rawgraphs/rawgraphs-core"
import { bubblechart } from "@rawgraphs/rawgraphs-charts"


// defining some data.
const userData = [
  { size: 10, price: 2, cat: "a" },
  { size: 12, price: 1.2, cat: "a" },
  { size: 1.3,price: 2, cat: "b" },
  { size: 1.5,price: 2.2, cat: "c" },
  { size: 10, price: 4.2, cat: "b" },
  { size: 10, price: 6.2, cat: "c" },
  { size: 12, price: 2.2, cat: "b" },
]

// getting the target HTML node
const root = document.getElementById("app")


// define a mapping between dataset and the visual model
const mapping = {
  x: { value: "size" },
  y: { value: "price" },
  color: { value: "cat" },
}

//instantiating the chart
const viz = chart(bubblechart, {
  data: userData,
  mapping,
})

//rendering into the HTML node
viz.renderToDOM(root)
```


## Live demo

Here's a live demo of the code shown above running in codesandbox


<iframe src="https://codesandbox.io/embed/rawgraphs-at-a-glance-mlu50?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style={{
    width: '100%',
    height: 700,
    border: 0,
  }}
  title="rawgraphs at a glance"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
