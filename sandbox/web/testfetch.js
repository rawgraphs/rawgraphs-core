import { chart, parseDataset } from "../../src";

const div = document.querySelector("#root");
const linechart = window.rawcharts.barchartstacked

fetch(
  "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
)
  .then((response) => response.json())
  .then((userData) => {

    const dataTypes = {
      totale_ospedalizzati: "number",
      isolamento_domiciliare: "number",
      data: {type: "date"},
    }
    const { dataset, errors } = parseDataset(userData, dataTypes);
    const reducedDataset = dataset.slice(dataset.length -100, dataset.length)
    const mapping = {
      stacks: { value: "data" },
      bars: { value: ["totale_ospedalizzati", "isolamento_domiciliare"], config: { aggregation: ["sum", "sum"] } },
    };

    const visualOptions = {
      colorScale: {
        scaleType: "ordinal",
        interpolator: "schemeCategory10"
      },
      showLegend: true,
      marginLeft : 50,
      marginBottom : 50,
    };

    const viz = chart(linechart, {
      data: reducedDataset,

      mapping,
      dataTypes,

      visualOptions,
    });

    viz.renderToDOM(div)
    
  });
