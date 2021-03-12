import * as d3Legend from "d3-svg-legend"
import { format } from "d3-format"

function scaleType(scale) {
  if (scale.interpolate) {
    return "continuous"
  } else if (scale.interpolator) {
    return "sequential"
  } else if (scale.invertExtent) {
    return "other"
  } else {
    return "ordinal"
  }
}

export function legend(
  legendColor,
  legendSize,
  legendWidth = 200,
  shapePadding = 5,
  shapeWidth = 15,
  shapeHeight = 15,
  margin = { top: 0, right: 5, bottom: 0, left: 5 }
) {
  const legendFn = (_selection) => {
    let d3LegendSize, d3legendColor
    const w = legendWidth - margin.left - margin.right

    const legendContainer = _selection
      .append("g")
      .attr("transform", `translate(${margin.left},${0})`)

    //draw size scale
    if (legendSize && legendSize.title) {
      legendContainer
        .append("g")
        .attr("class", "legendSize")
        .attr("transform", `translate(0,${margin.top})`)

      let d3LegendSize = d3Legend
        .legendSize()
        .scale(legendSize.scale)
        .cells(legendSize.scale.domain())
        .shape(legendSize.shape ? legendSize.shape : "circle")
        .title(legendSize.title)
        .titleWidth(w)
        .labelWrap(w - shapePadding - shapeWidth)
        .labelOffset(5)
        .shapePadding(
          legendSize.shape === "circle"
            ? legendSize.scale.range()[1]
            : shapePadding
        )

      legendContainer.select(".legendSize").call(d3LegendSize)
    }
    //draw color scale
    if (legendColor && legendColor.title) {
      const legendColorHeight = legendContainer.select(".legendSize").empty()
        ? 0
        : legendContainer.select(".legendSize").node().getBBox().height + 20

      legendContainer
        .append("g")
        .attr("class", "legendColor")
        .attr("transform", "translate(0," + legendColorHeight + ")")

      d3legendColor = d3Legend
        .legendColor()
        .shapePadding(shapePadding)
        .title(legendColor.title)
        .titleWidth(w)
        .labelWrap(w - shapePadding - shapeWidth)
        .labelOffset(5)
        .scale(legendColor.scale)

      if (scaleType(legendColor.scale) !== "ordinal") {
        d3legendColor
          .shapePadding(0)
          .orient("horizontal")
          .shapeWidth(1)
          .shapeHeight(10)
          .cells(w)
          .classPrefix("horizontal-")
          .labelAlign("start")
          .labels(({ i, genLength, generatedLabels, domain }) => {
            if (i === 0 || i === genLength - 1) {
              return generatedLabels[i]
            }
            if (domain.length === 3 && i === genLength / 2 - 1) {
              return format(".01f")((domain[0] + domain[2]) / 2)
            }
          })
      }

      legendContainer.select(".legendColor").call(d3legendColor)
    }

    //Hardcore style with much love
    legendContainer
      .selectAll("text")
      .attr("font-family", '"Arial", sans-serif')
      .attr("font-size", "10px")

    legendContainer
      .selectAll(".legendTitle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")

    legendContainer
      .selectAll(".horizontal-legendTitle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")

    legendContainer
      .selectAll(".horizontal-cell text")
      .style("text-anchor", "middle")
      .attr("text-anchor", "middle")

    legendContainer
      .selectAll(".horizontal-cell:first-of-type text")
      .style("text-anchor", "start")
      .attr("text-anchor", "start")

    legendContainer
      .selectAll(".horizontal-cell:last-of-type text")
      .style("text-anchor", "end")
      .attr("text-anchor", "end")

    legendContainer
      .selectAll(".legendSize circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")

    legendContainer
      .selectAll(".legendSize rect")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
  }

  legendFn.addColor = function (_title, _scale) {
    if (!arguments.length) return legendColor

    legendColor = { title: _title, scale: _scale }
    return legendFn
  }

  legendFn.addSize = function (_title, _scale, _shape) {
    if (!arguments.length) return legendSize
    legendSize = {
      title: _title,
      scale: _scale,
      shape: _shape,
    }
    return legendFn
  }

  legendFn.legendWidth = function (_legendWidth) {
    if (!arguments.length) return legendWidth
    legendWidth = _legendWidth
    return legendFn
  }

  return legendFn
}
