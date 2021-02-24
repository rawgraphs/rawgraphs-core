import { chart, parseDataset } from "../../src";

const div = document.querySelector("#root");
const barchart = window.rawcharts.barchart

fetch(
  "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
)
  .then((response) => response.json())
  .then((userData) => {

    const dataTypes = {
      nuovi_positivi: "number",
      data: "date",
    }
    const { dataset, errors } = parseDataset(userData, dataTypes);
    
    const mapping = {
      bars: { value: "data" },
      size: { value: "nuovi_positivi", config: { aggregation: "sum" } },
      color: { value: "nuovi_positivi", config: { aggregation: "sum" }}
    };

    const visualOptions = {
      colorScale: {
        scaleType: "diverging",
        // interpolator: "interpolateGreens",
        // userScaleValues: [
        //   { range: "#000000", domain: 0 },
        //   { range: "#0000a0", domain: 50000 }
        // ],
        // defaultColor: "red"
      }
    };

    const viz = chart(barchart, {
      data: dataset,

      mapping,
      dataTypes,

      visualOptions,
    });

    viz.renderToDOM(div)
    
  });
