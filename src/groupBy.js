import get from "lodash/get"

export default function groupByAsMap(arr, getter) {
  return arr.reduce(function (obj, item) {
    const groupKey = get(item, getter)

    if (!obj.has(groupKey)) {
      obj.set(groupKey, [])
    }

    obj.set(groupKey, obj.get(groupKey).concat([item]))

    return obj
  }, new Map())
}
