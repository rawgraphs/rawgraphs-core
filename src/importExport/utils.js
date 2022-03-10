
export function objectsToMatrix(listOfObjects, columns) {
  return listOfObjects.map((obj) => {
    return columns.map((col) => obj[col])
  })
}

export function matrixToObjects(matrix, columns) {
  return matrix.map((record) => {
    const obj = {}
    for (let i = 0; i < columns.length; i++) {
      obj[columns[i]] = record[i]
    }
    return obj
  })
}