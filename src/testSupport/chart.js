import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { arrayGetter } from "../../src"
import { extent } from "d3-array"
import { axisBottom, axisLeft } from "d3-axis"

const testChart = {
  dimensions: [
    {
      id: "x",
      name: "x",
      operation: "get",
      validTypes: ["number"],
      required: true,
    },
    {
      id: "y",
      name: "y",
      operation: "get",
      validTypes: ["number"],
      required: true,
    },
  ],

  mapData: function (data, mapping, dataTypes, dimensions) {
    const getX = arrayGetter(mapping["x"].value)
    const getY = arrayGetter(mapping["y"].value)

    const out = data.map((d) => ({
      x: getX(d),
      y: getY(d),
    }))
    return out
  },

  //declarative version ... with automatic mapping
  mapData_: {
    x: "get",
    y: "get",
  },

  options: {
    setOriginAt0: {
      type: "boolean",
      default: true,
      group: "chart",
      label: "Set origin at 0,0",
    },
  },

  render: function (node, data, visualOptions, mapping, originalData) {
    const { width, height } = visualOptions
    const margin = {
      top: 25,
      right: 20,
      bottom: 35,
      left: 40,
    }

    const x = scaleLinear()
      .domain(extent(data, (d) => d.x))
      .nice()
      .range([margin.left, width - margin.right])

    const y = scaleLinear()
      .domain(extent(data, (d) => d.y))
      .nice()
      .range([height - margin.bottom, margin.top])

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(axisBottom(x).ticks(width / 80))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", width)
            .attr("y", margin.bottom - 4)
            .attr("fill", "red")
            .attr("text-anchor", "end")
            .text(data.x)
        )

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "red")
            .attr("text-anchor", "start")
            .text(data.y)
        )

    const svg = select(node)

    svg.append("g").call(xAxis)

    svg.append("g").call(yAxis)

    // svg.append("g")
    //     .call(grid);

    svg
      .append("g")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 3)

    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("dy", "0.35em")
      .attr("x", (d) => x(d.x) + 7)
      .attr("y", (d) => y(d.y))
      .text((d) => d.y)
  },
}

export default testChart
