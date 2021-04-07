---
id: example-script
title: Quick example (direct script inclusion)
sidebar_label: Quick example (direct script inclusion)
slug: /example-script
---

Here's a super-quick example of using the rawgraphs from javascript code.

In this case we'll assume that we'll add rawgraphs to our webpage by
[direct script inclusion](install.md#direct-script-inclusion). Refer to 
[installation](install.md) for other options.

See the [live demo](#live-demo) at the end of the page for a complete example.


## Installation

We'll install the core with a `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@rawgraphs/rawgraphs-core"></script>
```

## Install some charts

To do something useful with rawgraphs-core, we'll need some charts as well.
Let's use the charts from the rawgraphs-charts package.
Again, we'll use a `<script>` tag in our HTML

```html
<script src="https://cdn.jsdelivr.net/npm/@rawgraphs/rawgraphs-charts"></script>
```

In this case the rawgraphs-core api will be available in the `raw` object in the global (window) scope,
and the rawgraphs-charts contents will be available in the `rawcharts` object.

## Rendering a bubblechart

In this example we'll build a bubblechart from the @rawgraphs/rawgraphs-core repository.
The final html could be the following

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/@rawgraphs/rawgraphs-core"></script>
    <script src="https://cdn.jsdelivr.net/npm/@rawgraphs/rawgraphs-charts"></script>
  </head>

  <body>
    <div id="app"></div>

    <script>
      const chart = raw.chart;
      const bubblechart = rawcharts.bubblechart;

      // defining some data.
      const userData = [
        { size: 10, price: 2, cat: "a" },
        { size: 12, price: 1.2, cat: "a" },
        { size: 1.3, price: 2, cat: "b" },
        { size: 1.5, price: 2.2, cat: "c" },
        { size: 10, price: 4.2, cat: "b" },
        { size: 10, price: 6.2, cat: "c" },
        { size: 12, price: 2.2, cat: "b" }
      ];

      // getting the target HTML node
      const root = document.getElementById("app");

      // define a mapping between dataset and the visual model
      const mapping = {
        x: { value: "size" },
        y: { value: "price" },
        color: { value: "cat" }
      };

      //instantiating the chart
      const viz = chart(bubblechart, {
        data: userData,
        mapping
      });

      //rendering into the HTML node
      viz.renderToDOM(root);
    </script>
  </body>
</html>

```

## Live demo

Here's a live demo of the code shown above running in codesandbox


<iframe src="https://codesandbox.io/embed/rawgraphs-script-inclusion-62e2m?fontsize=14&hidenavigation=1&light=dark&view=preview"
  style={{
    width: '100%',
    height: 700,
    border: 0,
  }}
  title="rawgraphs at a glance"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>


