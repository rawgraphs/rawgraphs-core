import * as V1 from "./importExportV1"
import * as V1_1 from "./importExportV1.1"
import get from "lodash/get"
import keyBy from "lodash/keyBy"

const DESERIALIZERS = keyBy([V1, V1_1], "VERSION")

/**
 * Serializes a rawgraphs project to json format
 * @param {Object} project 
 * @param {string} [version="latest"] 
 * @returns {string}
 */

export function serializeProject(project, version = "latest") {
  const defaultSerializer =
    version === "latest"
      ? DESERIALIZERS[V1_1.VERSION].serializeProject
      : () => {
          throw new Error("No serializer found for version " + version)
        }
  const serializer = get(
    DESERIALIZERS,
    version + ".serializeProject",
    defaultSerializer
  )
  return serializer(project)
}


/**
 * Deserializes a project from JSON
 * @param {string} serializedProject 
 * @param {object} charts 
 * @returns 
 */
export function deserializeProject(serializedProject, charts) {
  try {
    const parsedProject = JSON.parse(serializedProject)
    const version = get(parsedProject, "version", "unknown")
    if (DESERIALIZERS[version]) {
      try {
        return DESERIALIZERS[version].deserializeProject(parsedProject, charts)
      } catch (e) {
        throw new Error("Can't open your project. " + e.message)
      }
    } else {
      throw new Error("Can't open your project. Invalid file")
    }
  } catch (e) {
    throw new Error("Can't open your project. " + e.message)
  }
}

export function registerSerializerDeserializer(
  version,
  serializer,
  deserializer
) {
  DESERIALIZERS[version] = {
    serializeProject: serializer,
    deserializeProject: deserializer,
    VERSION: version,
  }
}
