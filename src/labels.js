import { descending } from "d3-array"
import { select } from "d3-selection"
import { quadtree as qt } from "d3-quadtree"
// adapted from https://observablehq.com/@bmschmidt/finding-text-occlusion-with-quadtrees

function hasOverlaps(corners, compCorners) {
  return (
    corners[2] < compCorners[3] &&
    corners[3] > compCorners[2] &&
    corners[0] < compCorners[1] &&
    corners[1] > compCorners[0]
  )
}

function insert_and_check(datum, quadtree) {
  const corners = datum._bbox
  quadtree._max_width = quadtree._max_width || 0
  quadtree._max_height = quadtree._max_height || 0
  datum._occluded = false

  quadtree["visit"](
    (node, x0, y0, x1, y1) => {
      if (datum._occluded) {
        return true
      }

      if (node.length) {
        const box_intersects_quad = hasOverlaps(corners, [
          x0 - quadtree._max_width / 2,
          x1 + quadtree._max_width / 2,
          y0 - quadtree._max_height / 2,
          y1 + quadtree._max_height / 2,
        ])
        if (!box_intersects_quad) {
          return true
        } else {
          return undefined
        }
      } else {
        if (hasOverlaps(corners, node.data._bbox)) {
          datum._occluded = true
          return "break"
        }
      }
    },
    [quadtree.x()(datum), quadtree.y()(datum)]
  )

  if (!datum._occluded) {
    quadtree.add(datum)
    if (quadtree._max_width < corners[1] - corners[0]) {
      quadtree._max_width = corners[1] - corners[0]
    }
    if (quadtree._max_height < corners[3] - corners[2]) {
      quadtree._max_height = corners[3] - corners[2]
    }
  }
}

function formatOcclusion(data) {
  let labels
  labels = qt()
    .x((d) => (d._bbox[0] + d._bbox[1]) / 2)
    .y((d) => (d._bbox[2] + d._bbox[3]) / 2)

  //labels.extent([-80, -35], [width + 80, height + 35]);
  data.forEach((d, i) => {
    insert_and_check(d, labels)
    d.order = i
  })
}

export function labelsOcclusion(d3Selection, priority = (d) => d.priority) {
  if (!d3Selection.size()) return
  const labels = []
  d3Selection.each((d, i, e) => {
    const bbox = e[i].getBoundingClientRect()
    labels.push({
      priority: priority(d) || 0,
      node: e[i],
      _bbox: [bbox.x, bbox.x + bbox.width, bbox.y, bbox.y + bbox.height],
    })
  })

  labels.sort((a, b) => descending(a.priority, b.priority))
  formatOcclusion(labels)
  const filled = []

  labels.forEach((d) => {
    select(d.node).style("opacity", d._occluded ? 0 : 1)
    if (!d._occluded) filled.push(d)
  })

  return filled
}
