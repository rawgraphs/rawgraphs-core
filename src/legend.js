import * as d3Legend from "d3-svg-legend";

function scaleType(scale) {
  if (scale.interpolate) {
    return "continuous";
  } else if (scale.interpolator) {
    return "sequential";
  } else if (scale.invertExtent) {
    return "other";
  } else {
    return "ordinal";
  }
}

export function rawgraphsLegend(
  legendColor,
  legendSize,
  legendWidth = 200,
  shapePadding = 5,
  shapeWidth = 15,
  shapeHeight = 15,
  margin = { top: 20, right: 5, bottom: 0, left: 5 }
) {
  const legend = (_selection) => {
    const w = legendWidth - margin.left - margin.right;

    const legendContainer = _selection
      .append("g")
      .attr("transform", `translate(${margin.left},${0})`);

    //draw size scale
    if (legendSize && legendSize.title) {
      legendContainer
        .append("g")
        .attr("class", "legendSize")
        .attr("transform", `translate(0,${margin.top})`);

      var d3LegendSize = d3Legend
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
        );

      legendContainer.select(".legendSize").call(d3LegendSize);
    }
    //draw color scale
    if (legendColor && legendColor.title) {
      const legendColorHeight = legendContainer.select(".legendSize").empty()
        ? 0
        : legendContainer.select(".legendSize").node().getBBox().height +
          margin.top;

      legendContainer
        .append("g")
        .attr("class", "legendColor")
        .attr(
          "transform",
          "translate(0," + (legendColorHeight + margin.top) + ")"
        );

      const d3legendColor = d3Legend
        .legendColor()
        .shapePadding(shapePadding)
        .title(legendColor.title)
        .titleWidth(w)
        .labelWrap(w - shapePadding - shapeWidth)
        .labelOffset(5)
        .scale(legendColor.scale);

      if (scaleType(legendColor.scale) !== "ordinal") {
        d3legendColor
          .shapePadding(0)
          .orient("horizontal")
          .shapeWidth(1)
          .shapeHeight(10)
          .cells(w)
          .classPrefix("horizontal-")
          .labels(({ i, genLength, generatedLabels, domain }) => {
            if (i === 0 || i === genLength - 1) {
              return generatedLabels[i];
            }
            if (domain.length === 3 && i === genLength / 2 - 1) {
              return domain[1];
            }
          });
      }

      legendContainer.select(".legendColor").call(d3legendColor);
    }
  };

  legend.addColor = function (_title, _scale) {
    if (!arguments.length) return legendColor;

    legendColor = { title: _title, scale: _scale };
    return legend;
  };

  legend.addSize = function (_title, _scale, _shape, _extent) {
    if (!arguments.length) return legendSize;
    legendSize = {
      title: _title,
      scale: _scale,
      shape: _shape,
      extent: _extent,
    };
    return legend;
  };

  legend.legendWidth = function (_legendWidth) {
    if (!arguments.length) return legendWidth;
    legendWidth = _legendWidth;
    return legend;
  };

  return legend;
}
