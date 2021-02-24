import { chart, parseDataset } from "../../src";

const div = document.querySelector("#root");
const bubblechart = window.rawcharts.bubblechart

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
      x: { value: "data" },
      y: { value: "nuovi_positivi", config: { aggregation: "sum" } },
    };

    const visualOptions = {
      colorScale: {
        scaleType: "sequential",
        interpoator: "interpolateBlues",
        userScaleValues: [
          { range: "#000000", domain: 0 },
          { range: "#a00000", domain: 100 }
        ],
        defaultColor: "red"
      }
    };

    const viz = chart(bubblechart, {
      data: dataset,

      mapping,
      dataTypes,

      visualOptions
    });

    viz.renderToDOM(div)
    
  });
